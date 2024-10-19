import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
    try {
        const { token, userEmail, requestedEmail, action } = await req.json();
        
        if (!token) return NextResponse.json({ message: "Token is required" }, { status: 400 });
        if (!userEmail) return NextResponse.json({ message: "User email is required" }, { status: 400 });
        if (!requestedEmail) return NextResponse.json({ message: "Requested email is required" }, { status: 400 });
        if (!action || !['accept', 'reject'].includes(action)) {
            return NextResponse.json({ message: "Valid action is required ('accept' or 'reject')" }, { status: 400 });
        }

        await connectDB();

        const sharedChart = await prisma.sharedChart.findUnique({
            where: {
                chartId: token,
            },
        });

        if (!sharedChart) {
            return NextResponse.json({ message: "Chart not found" }, { status: 404 });
        }

        // Ensure the current user is the owner of the chart
        if (sharedChart.ownerEmail !== userEmail) {
            return NextResponse.json({ message: "You are not authorized to update access requests for this chart." }, { status: 403 });
        }

        // Handle accept or reject actions
        if (action === 'accept') {
            // Move the email from requestEmails to receiverEmails
            if (sharedChart.requestEmails.includes(requestedEmail)) {
                await prisma.sharedChart.update({
                    where: { chartId: token },
                    data: {
                        requestEmails: { set: sharedChart.requestEmails.filter(email => email !== requestedEmail) },
                        receiverEmails: { push: requestedEmail },
                    },
                });
                return NextResponse.json({ message: "Access granted" }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Requested email not found" }, { status: 404 });
            }
        } else if (action === 'reject') {
            // Remove the email from requestEmails
            if (sharedChart.requestEmails.includes(requestedEmail)) {
                await prisma.sharedChart.update({
                    where: { chartId: token },
                    data: {
                        requestEmails: { set: sharedChart.requestEmails.filter(email => email !== requestedEmail) },
                    },
                });
                return NextResponse.json({ message: "Access request rejected" }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Requested email not found" }, { status: 404 });
            }
        }
    } catch (error) {
        console.error('Error updating access requests:', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}