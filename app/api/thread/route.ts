import { NextResponse } from "next/server";
import OpenAI from "openai";

export const POST = async () => {
  const openai = new OpenAI();

  const thread = await openai.beta.threads.create();

  return NextResponse.json({ thread, success: true }, { status: 201 });
};
