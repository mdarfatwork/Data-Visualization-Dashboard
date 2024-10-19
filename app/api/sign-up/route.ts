import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
    try {
        const { emailAddress, createdUserId } = await req.json();
        const createdAt = new Date();

        await connectDB();

        const newUser = await prisma.user.create({
            data: {
                email: emailAddress,
                clerkId: createdUserId,
                createdAt: createdAt,
            },
        });

        return NextResponse.json({ user: newUser }, { status: 200 });
    } catch (error: any) {
        console.error(`This is the Error of catch block in register is ${error}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}