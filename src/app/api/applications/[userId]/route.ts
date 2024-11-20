import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { Error } from "@/types/ErrorTypes";


export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
){
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const allApplicationsOfUser = await prismaClient.application.findMany({
      where: { userId: params.userId },
    })

    return NextResponse.json({ success: true, data: allApplicationsOfUser }, { status: 200 });

  } catch (error: unknown) {
    const Error = error as Error 
    console.log(Error.message);
    return NextResponse.json({ error: Error.message }, { status: 500 })
  }

}