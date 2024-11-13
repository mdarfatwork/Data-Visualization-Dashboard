import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
    try {
        const { email, chartName, filter, selectedProduct } = await req.json();
        const user = await currentUser();
        const ownerEmail = user?.emailAddresses[0].emailAddress;

        await connectDB();

        if (!ownerEmail) {
            return NextResponse.json({ error: "Owner email not found." }, { status: 400 });
        }

        let chartId: string = "";
        let unique = false;
        while (!unique) {
            chartId = uuidv4(); // Generate a new UUID
            const existingChart = await prisma.sharedChart.findUnique({
                where: { chartId },
            });
            unique = !existingChart; // Ensure uniqueness
        }

        // Save the information to the database without the encryptedUrl
        await prisma.sharedChart.create({
            data: {
                ownerEmail,
                receiverEmails: [email], // Assuming you're sharing with a single email for now
                chartName,
                filter, // This can stay as JSON
                selectedProduct,
                chartId, // Store the plain chartId
                createdAt: new Date(),
            },
        });

        const shareUrl = `/chart?token=${chartId}`; // Use the encrypted chartId

        return NextResponse.json({ message: "Chart URL created successfully.", shareUrl });
    } catch (error) {
        console.error(`This is the Error when we create chart url ${error}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}