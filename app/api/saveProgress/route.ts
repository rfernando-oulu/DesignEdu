import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getUserFromClerkID } from "@/utils/auth";

export const POST = async (request: Request) => {
  const user = await getUserFromClerkID();
  const {content} = await request.json()

  console.log("content is " + content)

  const progress = await prisma.progress.create({
    data: {
      userId: user.id,
      week: content.week,
      content: {
        title: content.title,
        description: content.description,
        urls: content.urls,
        youtube: content.youtube,
        imageUrl: content.imageUrl
      },
    },
  });

  return NextResponse.json({data: progress})
};
