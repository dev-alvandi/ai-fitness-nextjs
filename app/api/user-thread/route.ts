import { prismadb } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { UserThread } from "@prisma/client";
import { NextResponse } from "next/server";
import OpenAI from "openai";

interface ResponseProps {
  success: boolean;
  message?: string;
  userThread?: UserThread;
}

export const GET = async () => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json<ResponseProps>(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 }
    );
  }

  try {
    const userThread = await prismadb.userThread.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (userThread) {
      return NextResponse.json<ResponseProps>(
        { success: true, userThread: userThread },
        { status: 200 }
      );
    }

    const openai = new OpenAI();
    const thread = await openai.beta.threads.create();

    const newUserThread = await prismadb.userThread.create({
      data: {
        userId: user.id,
        threadId: thread.id,
      },
    });

    return NextResponse.json<ResponseProps>(
      { success: true, userThread: newUserThread },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: error,
        success: false,
      },
      { status: 500 }
    );
  }
};
