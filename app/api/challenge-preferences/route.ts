import { prismadb } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id, challengeId, sendNotifications } = await req.json();

  if (!id || !challengeId || sendNotifications === undefined) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const updatedChallengePreferences =
      await prismadb.challengePreferences.update({
        where: {
          id: id,
          userId: user.id,
        },
        data: {
          challengeId: challengeId,
          sendNotifications: sendNotifications,
        },
      });

    return NextResponse.json(
      { success: true, data: updatedChallengePreferences },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal error during saving preference" },
      { status: 500 }
    );
  }
};
