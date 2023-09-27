import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getUserFromClerkID } from "@/utils/auth";
import { URL } from 'url';


export const GET = async (request: Request) => {
  const user = await getUserFromClerkID();

  const urlObj = new URL(request.url);
  const week = urlObj.searchParams.get('week');
  console.log(week)
  console.log(user.id)
  

  const latestSubmission = await prisma.progress.findFirst({
    where: { userId: user.id, week: Number(week) },
    orderBy: { createdAt: 'desc' },
    select: {
      content: true,
    },
  });

  //console.log(JSON.stringify(latestSubmission, null, 2));
  return NextResponse.json({data: latestSubmission})
};
