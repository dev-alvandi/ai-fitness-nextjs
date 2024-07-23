import { prismadb } from "@/lib/prismadb";
import { UserMeta, UserThread } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";
import OpenAI from "openai";

interface UserThreadMap {
  [userId: string]: UserThread;
}

interface UserMetaMap {
  [userId: string]: UserMeta;
}

export const POST = async (req: Request) => {
  // Validation
  const { challengeId, secret } = await req.json();

  if (!challengeId || !secret) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      {
        status: 400,
      }
    );
  }

  if (secret !== process.env.APP_SECRET_KEY) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      {
        status: 401,
      }
    );
  }

  // Define work out message prompt
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
       Generate an ultra-intense, hard-hitting motivational message, followed by a concise, bullet-pointed, no-equipment-needed workout plan. The time of day provided should be taken into account. This output should strictly contain two parts: first, a motivational message in the style of David Goggins, as depicted in Jesse Itzler's 'Living with a SEAL', but even more extreme. The message must be direct, confrontational, and incorporate Goggins' known phrases like 'poopy pants', 'stay hard', and 'taking souls'. The second part should be a workout list: intense, high-impact exercises that can be done anywhere, designed to be completed within 10 minutes. The output must only include these two components, nothing else. The language of the generated messages to the user must be primarily in Swedish. 
       
       Here's an example output that you should follow:
       
       Dags att ta i! Inga fler ursäkter, ingen fjäsk-attityd. Du är starkare än du tror. Håll dig hård, ta själar, och krossa den här morgonen med allt du har. Du har 10 minuter på dig att utplåna den här träningen. Detta är din slagmark, och du är krigaren. Låt varje sekund räknas!

        - 30 Burpees – explodera vid varje hopp
        - 40 Jumping Jacks – snabbare, pressa dina gränser
        - 50 Mountain Climbers – obevekligt tempo
        - 60 High Knees – driva på dem med raseri
        - 2 Minuter Plankan – stabil och oföränderlig
       `,
    },
    {
      role: "user",
      content: `Generate a new David Goggins workout. Remember, only respond in the format specifed earlier including Swedish language as the primary language. Nothing else`,
    },
  ];

  //  Use OpenAI to generate work out
  const {
    data: { message, success },
  } = await axios.post<{ message?: string; success: boolean }>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/openai`,
    {
      messages,
      secret: process.env.APP_SECRET_KEY,
    }
  );

  if (!message || !success) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong with generate openai response",
      },
      {
        status: 500,
      }
    );
  }

  // console.log(message);

  // Grab all challenge preferences
  const challengePreferences = await prismadb.challengePreferences.findMany({
    where: {
      challengeId,
    },
  });

  // console.log("challengePreferences", challengePreferences);

  const userIds = challengePreferences.map((cp) => cp.userId);

  // console.log("userIds", userIds);

  //  Grab all user threads
  const userThreads = await prismadb.userThread.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  // Grab all user metadata
  const userMetas = await prismadb.userMeta.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });
  // console.log("userMetas", userMetas);

  const userThreadMap: UserThreadMap = userThreads.reduce((map, thread) => {
    map[thread.userId] = thread;
    return map;
  }, {} as UserThreadMap);

  const userMetaMap = userMetas.reduce((map, meta) => {
    map[meta.userId] = meta;
    return map;
  }, {} as UserMetaMap);

  // console.log(userMetas);

  const threadAndNotificationsPromises: Promise<any>[] = [];
  try {
    challengePreferences.forEach((cp) => {
      const userThread = userThreadMap[cp.userId];

      // Add message to thread
      if (userThread) {
        threadAndNotificationsPromises.push(
          axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/message/create`, {
            message,
            threadId: userThread.threadId,
            fromUser: false,
          })
        );

        if (cp.sendNotifications) {
          const correspondingUserMeta = userMetaMap[cp.userId];
          // console.log(userMetaMap);
          threadAndNotificationsPromises.push(
            axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-notifications`,
              {
                subscription: {
                  endpoint: correspondingUserMeta.endpoint,
                  keys: {
                    auth: correspondingUserMeta.auth,
                    p256dh: correspondingUserMeta.p256dh,
                  },
                },
                message,
              }
            )
          );
        }
      }
    });

    await Promise.all(threadAndNotificationsPromises);

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal fuck up", success: false },
      { status: 500 }
    );
  }
};
