import { NextResponse } from "next/server";
import OpenAI from "openai";

interface BodyProps {
  message: string;
  threadId: string;
  fromUser: boolean;
}

export const POST = async (req: Request) => {
  const { message, threadId, fromUser = false }: BodyProps = await req.json();

  if (!message) {
    return NextResponse.json(
      { error: "Message value is missing.", success: false },
      { status: 400 }
    );
  }

  if (!threadId) {
    return NextResponse.json(
      { error: "Thread id value is missing.", success: false },
      { status: 400 }
    );
  }

  console.log(threadId);

  const openai = new OpenAI();
  try {
    const threadMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
      metadata: {
        fromUser: fromUser.toString(),
      },
    });

    return NextResponse.json(
      { message: threadMessage, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "An error occurred during creating a new message",
        success: false,
      },
      { status: 500 }
    );
  }
};
