//get lal gig of a specific user
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { userId } = params;
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const gigs = await prismaClient.gigs.findMany({
      where: {
        postedById: userId,
      },
      include: {
        postedBy: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!gigs || gigs.length === 0) {
      return NextResponse.json(
        { message: "No gigs found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: gigs },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
