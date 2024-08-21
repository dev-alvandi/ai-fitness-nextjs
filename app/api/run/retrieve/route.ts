import { NextResponse } from "next/server";
import OpenAI from "openai";

interface BodyProps {
  threadId: string;
  runId: string;
}

export const POST = async (req: Request) => {
  const { threadId, runId }: BodyProps = await req.json();

  if (!threadId) {
    return NextResponse.json(
      { error: "Thread id value is missing.", success: false },
      { status: 400 }
    );
  }

  if (!runId) {
    return NextResponse.json(
      { error: "Run id value is missing.", success: false },
      { status: 400 }
    );
  }

  const openai = new OpenAI();

  try {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);

    // console.log("From OpenAPI run retrieve", run);

    return NextResponse.json({ run, success: true }, { status: 201 });
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
