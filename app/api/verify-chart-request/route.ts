import { NextResponse, NextRequest } from "next/server";
import { connectDB, prisma } from "@/lib/connectdb";

export async function POST(req: NextRequest) {
  try {
    const { token, userEmail } = await req.json();

    await connectDB();

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found." }, { status: 400 });
    }

    const sharedChart = await prisma.sharedChart.findUnique({
      where: {
        chartId: token, // token is chartId in this case
      },
    });

    // Step 2: Check if the chart exists
    if (!sharedChart) {
      return NextResponse.json({ error: "Chart not found." }, { status: 404 });
    }

    // Step 3: Verify if the user is the owner
    if (sharedChart.ownerEmail === userEmail) {
      const requestEmails = sharedChart.requestEmails;
      return NextResponse.json({
        message: "Chart access granted to owner.",
        data: {
          filter: sharedChart.filter,
          selectedProduct: sharedChart.selectedProduct,
          requestEmails: requestEmails,
          isOwner: true, // Add this flag
        },
      });
    }

    // Step 4: Verify if the userEmail is in the receiverEmails list (has access)
    const isAuthorized = sharedChart.receiverEmails.includes(userEmail);
    if (isAuthorized) {
      return NextResponse.json({
        message: "Chart access granted.",
        data: {
          filter: sharedChart.filter,
          selectedProduct: sharedChart.selectedProduct,
        },
      });
    }

    // Step 5: Check if the user has already requested access
    const hasRequestedAccess = sharedChart.requestEmails.includes(userEmail);
    if (hasRequestedAccess) {
      return NextResponse.json({
        error: "Access already requested.",
        message: "You have already requested access to this chart.",
      }, { status: 409 }); // 409 Conflict
    }

    // Step 6: If not authorized and no request, return the authorization error
    return NextResponse.json({ error: "You are not authorized to view this chart." }, { status: 403 });
  } catch (error) {
    console.error(`This is the error when verifying the token: ${error}`);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}