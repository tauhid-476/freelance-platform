//update , delete and get a speific gig
import { prismaClient } from "@/lib/db";
import { gigSchema } from "@/zod/gigSchema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { deleteImage, handleImageUpload } from "@/lib/images";

export async function GET(
  req: NextRequest,
  { params }: { params: { gigId: string } }
) {
  try {
    const gig = await prismaClient.gigs.findUnique({
      where: {
        id: params.gigId,
      },
      include: {
        postedBy: {
          select: {
            email: true,
          },
        },
        applications: {
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!gig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, data: gig },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json({ error: "Error fetching gig" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { gigId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const imageFile = formData.get("image") as File | null;
    let newImageUrl = null;

    const existingGig = await prismaClient.gigs.findUnique({
      where: { id: params.gigId },
    });

    if (!existingGig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    if(existingGig.postedById !== session.user.id){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if(imageFile){
      if(existingGig.image){
        await deleteImage(existingGig.image)
      }
      newImageUrl = await handleImageUpload(imageFile);
    }


    const updateData = {
      title: formData.get("title") as string | null,
      description: formData.get("description") as string | null,
      maxApplications: formData.get("maxApplications") as string | null,
      daysLeft: formData.get("daysLeft") as string | null,
      image:  newImageUrl || existingGig.image,
      reward: formData.get("reward") as string | null,
      isActive: formData.get("isActive") === "true",
    };

    const validatedData = gigSchema.partial().parse({
      ...updateData,
      maxApplications: updateData.maxApplications
        ? parseInt(updateData.maxApplications)
        : undefined,
      daysLeft: updateData.daysLeft ? parseInt(updateData.daysLeft) : undefined,
      reward: updateData.reward ? parseFloat(updateData.reward) : undefined,
    });

   

    const updatedGig = await prismaClient.gigs.update({
      where: { id: params.gigId },
      data: validatedData
    });

    return NextResponse.json(
      { success: true, data: updatedGig },
      { status: 200 }
    );


  } catch (error: unknown) {
    return NextResponse.json({ error: "Error updating gig" }, { status: 500 });
  }
}


export async function DELETE(
  { params }: { params: { gigId: string } }
){

  try {
    
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingGig = await prismaClient.gigs.findUnique({
      where: { id: params.gigId },
    });

    if (!existingGig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    if(existingGig.postedById !== session.user.id){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedGig = await prismaClient.gigs.delete({
      where: { id: params.gigId },
    });

    return NextResponse.json(
      { success: true, data: deletedGig },
      { status: 200 }
    );
    
  } catch (error: unknown) {
    return NextResponse.json({ error: "Error updating gig" }, { status: 500 });
  }

}