//hiring a speific
import { NextRequest, NextResponse } from "next/server";
import { sendHiredEmail, sendRejectionEmail } from "@/lib/sendEmail";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { gigId: string } }
) {
  const { applicantId } = await req.json();
  const { gigId } = params;
  if (!applicantId || !gigId) {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }
  try {
    const result = await prismaClient.$transaction(async (tx) => {
      const hiredApplication = await tx.application.update({
        where: { id: applicantId },
        data: { status: "ACCEPTED" },
        include: { user: true, gig: true },
      });

      const otherApplicants = await tx.application.findMany({
        where: {
          gigId,
          NOT: { id: applicantId },
          status: "PENDING",
        },
        include: { user: true },
      });

      await tx.application.updateMany({
        where: {
          gigId,
          NOT: { id: applicantId },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      });

      await tx.gigs.update({
        where: { id: gigId },
        data: { isActive: false },
      });

      return { hiredApplication, otherApplicants };
    });

    const { hiredApplication, otherApplicants } = result;

    //sending mails

    //hired mails
    if (hiredApplication.user.email && hiredApplication.gig.title) {
      await sendHiredEmail(
        hiredApplication.user.email,
        hiredApplication.gig.title
      );
    }

    const emailPromises = otherApplicants.map((applicant) => {
      if (applicant.user.email && hiredApplication.gig.title) {
        return sendRejectionEmail(
          applicant.user.email,
          hiredApplication.gig.title
        );
      }
    });

    //filter out all the undeined promises (thats fails th eabove if condition )
    await Promise.all(emailPromises.filter(Boolean));

    return NextResponse.json({
      message: "Hiring process completed",
      hiredApplicationId: hiredApplication.id,
    });


  } catch (error: unknown) {
    return NextResponse.json({ error: "Error fetching gig" }, { status: 500 });
  }
}
