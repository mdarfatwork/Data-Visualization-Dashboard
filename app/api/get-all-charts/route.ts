import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
    try {
        const { userEmail } = await req.json();

        await connectDB();

        if (!userEmail) {
            return NextResponse.json({ error: "User email not found." }, { status: 400 });
        }

        // Fetch charts owned by the user
        const myCharts = await prisma.sharedChart.findMany({
            where: {
                ownerEmail: userEmail,
            },
        });

        const sharedCharts = await prisma.sharedChart.findMany({
            where: {
                receiverEmails: {
                    has: userEmail, 
                },
            },
        });

        return NextResponse.json({
            myCharts,
            sharedCharts,
        });

    } catch (error) {
        console.error(`This is the error when verifying the token: ${error}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}