import ProfileContainer from "@/components/profile-container";
import { prismadb } from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";

const ProfilePage = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let challengePreferences = await prismadb.challengePreferences.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!challengePreferences) {
    challengePreferences = await prismadb.challengePreferences.create({
      data: {
        userId: user.id,
        challengeId: "EASY",
      },
    });
  }

  return (
    <div className="max-w-screen-lg m-10 lg:mx-auto">
      <ProfileContainer challengePreferences={challengePreferences} />
    </div>
  );
};

export default ProfilePage;
