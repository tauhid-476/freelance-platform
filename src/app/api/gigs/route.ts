import { NextRequest, NextResponse } from "next/server";
import { gigSchema } from "@/zod/gigSchema";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { handleImageUpload } from "@/lib/images";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 403 }
      );
    }

    // Detailed logging
    console.log("Session user:", session.user);

    const user = await prismaClient.user.findFirst({
      where: { email: session.user.email },
    });

    if (!user?.email) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    // Detailed form data logging
    console.log("Received FormData:", Object.fromEntries(formData.entries()));

    const imageFile = formData.get("image");
    let imageUrl = "";

    if (imageFile && imageFile instanceof File) {
      imageUrl = await handleImageUpload(imageFile);
    }

    // More robust parsing with type safety
    const gigData = {
      title: formData.get("title")?.toString() || "Untitled",
      description: formData.get("description")?.toString() || "No description provided",
      maxApplications: Math.max(
        0, 
        parseInt(formData.get("maxApplications")?.toString() || "0", 10)
      ),
      daysLeft: Math.max(
        0, 
        parseInt(formData.get("daysLeft")?.toString() || "0", 10)
      ),
      image: imageUrl,
      reward: Math.max(
        0, 
        parseFloat(formData.get("reward")?.toString() || "0")
      ),
      isActive: formData.get("isActive")?.toString() === "true",
      postedById: user.email,
    };

    // Comprehensive error handling for validation
    try {
      const validatedData = gigSchema.parse(gigData);

      const gig = await prismaClient.gigs.create({
        data: validatedData,
      });

      return NextResponse.json(
        { success: true, data: gig },
        { status: 201 }
      );
    } catch (validationError) {
      // Handle Zod validation errors specifically
      if (validationError instanceof ZodError) {
        console.error("Validation Errors:", validationError.errors);
        return NextResponse.json(
          { 
            message: "Validation Failed", 
            errors: validationError.errors 
          },
          { status: 400 }
        );
      }
      
      // Re-throw other errors
      throw validationError;
    }
  } catch (error: unknown) {
    // Comprehensive error logging
    console.error("Full error object:", error);

    // Ensure error is an Error object
    const errorMessage = error instanceof Error 
      ? error.message 
      : String(error);

    return NextResponse.json(
      { 
        error: errorMessage,
        // Optional: include stack trace in development
        ...(process.env.NODE_ENV === 'development' && error instanceof Error 
          ? { stack: error.stack } 
          : {})
      },
      { status: 500 }
    );
  }
}

// GET function remains the same
export async function GET() {
  try {
    const gigs = await prismaClient.gigs.findMany({
      where: { isActive: true },
    });
    return NextResponse.json(gigs);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : String(error);

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}