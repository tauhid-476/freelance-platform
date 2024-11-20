//create application , get all application
//apply for a speific gig

import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { Error } from "@/types/ErrorTypes";
import { applicationSchema } from "@/zod/applicationSchema";

export async function POST(
  req: NextRequest,
  { params }: { params: { gigId: string } }
) {
  const validData = applicationSchema.parse(req.body);

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
        gigId: params.gigId,
        userId: session.user.id,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Already applied' },
        { status: 400 }
      );
    }
    

    const newApplication = await prismaClient.application.create({
      data: {
        ...validData,
        gigId: params.gigId,
        userId: session.user.id,
        status: "PENDING",
        //initially
      },
    });

    return NextResponse.json({ success: true, data: newApplication }, { status: 201 });

  } catch (error: unknown) {
    const Error = error as Error 
    console.log(Error.message);
    return NextResponse.json({ error: Error.message }, { status: 500 })
  }
}


//get all applications of a speific gig
export async function GET(
  req: NextRequest,
  { params }: { params: { gigId: string } }
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

    //if gig doessnt exist , how can i get the applications ??
    const existingGig = await prismaClient.gigs.findUnique({
      where: { id: params.gigId },
    });

    if(!existingGig){
      return NextResponse.json({ error: "Gig not found" }, { status: 404 });
    }
    if(existingGig.postedById !== session.user.id){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allApplicationsOfGig = await prismaClient.application.findMany({
      where: { gigId: params.gigId}
    })

    return NextResponse.json({ success: true, data: allApplicationsOfGig }, { status: 200 });

  } catch (error: unknown) {
    const Error = error as Error 
    console.log(Error.message);
    return NextResponse.json({ error: Error.message }, { status: 500 })
  }
}
