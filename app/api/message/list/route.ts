import { NextResponse } from "next/server";
import OpenAI from "openai";

interface BodyProps {
  threadId: string;
}

export const POST = async (req: Request) => {
  const { threadId }: BodyProps = await req.json();

  if (!threadId) {
    return NextResponse.json(
      { error: "Thread id value is missing.", success: false },
      { status: 400 }
    );
  }
  const openai = new OpenAI();
  try {
    const response = await openai.beta.threads.messages.list(threadId);

    return NextResponse.json(
      { messages: response.data, success: true },
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
