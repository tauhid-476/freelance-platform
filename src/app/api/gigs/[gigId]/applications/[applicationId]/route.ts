//get a specific application of a specific gig 

import {  NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { Error } from "@/types/ErrorTypes";

export async function GET(
  { params }: { params: { gigId: string; applicationId: string } }
){

  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const existingGig = await prismaClient.gigs.findUnique({
      where: { id: params.gigId },
    });

    if (!existingGig) {
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }

    if (existingGig.postedById !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    const application = await prismaClient.application.findFirst({
      where: {
        id: params.applicationId,
        gigId: params.gigId
      }
    })

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Return the application details
    return NextResponse.json({ success: true, data: application }, { status: 200 });
    
  } catch (error: unknown) {
    const Error = error as Error 
    console.log(Error.message);
    return NextResponse.json({ error: Error.message }, { status: 500 })
  }
}

export async function DELETE(
  { params }: { params: { gigId: string; applicationId: string } }
) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const existingApplication = await prismaClient.application.findFirst({
      where: { 
        id: params.applicationId,
        gigId: params.gigId
      },
    });

    if(!existingApplication) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if(existingApplication.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedApplication = await prismaClient.application.delete({
      where: {
        id: params.applicationId
      }
    })

    return NextResponse.json({ success: true, data: deletedApplication }, { status: 200 });
  }catch(error: unknown) {
    const Error = error as Error 
    console.log(Error.message);
    return NextResponse.json({ error: Error.message }, { status: 500 })
  }
}