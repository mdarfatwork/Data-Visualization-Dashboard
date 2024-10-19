import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
    try {
        const { token, userEmail } = await req.json();
        
        if (!token) return NextResponse.json({ message: "Token is required" }, { status: 400 });
        if (!userEmail) return NextResponse.json({ message: "User email is required" }, { status: 400 });

        await connectDB();

        // Fetch the chart using the token (chartId in your schema)
        const sharedChart = await prisma.sharedChart.findUnique({
            where: {
                chartId: token,
            },
        });

        if (!sharedChart) {
            return NextResponse.json({ message: "Chart not found" }, { status: 404 });
        }

        // Verify that the current user is the owner of the chart
        if (sharedChart.ownerEmail !== userEmail) {
            return NextResponse.json({ message: "You are not authorized to view access requests for this chart." }, { status: 403 });
        }

        // Return the list of emails that have requested access
        return NextResponse.json({
            requestEmails: sharedChart.requestEmails,
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching access requests:', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}