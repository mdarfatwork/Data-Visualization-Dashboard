import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
    try {
        const { token, userEmail } = await req.json();

        await connectDB();

        if (!userEmail) {
            return NextResponse.json({ error: "User email not provided." }, { status: 400 });
        }

        // Find the chart by the provided token (chartId)
        const sharedChart = await prisma.sharedChart.findUnique({
            where: { chartId: token },
        });

        if (!sharedChart) {
            return NextResponse.json({ error: "Chart not found." }, { status: 404 });
        }

        // Check if the email is already in the requestEmails list
        const alreadyRequested = sharedChart.requestEmails.includes(userEmail);
        if (alreadyRequested) {
            return NextResponse.json({ error: "Access already requested." }, { status: 400 });
        }

        // Add user email to the requestEmails list
        const updatedChart = await prisma.sharedChart.update({
            where: { chartId: token },
            data: {
                requestEmails: {
                    push: userEmail,
                },
            },
        });

        return NextResponse.json({
            message: "Access request submitted successfully.",
            data: updatedChart,
        });
    } catch (error) {
        console.error("Error while requesting access:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}