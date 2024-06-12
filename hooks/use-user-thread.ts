import { UserThread } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserInfoProps {
  userThread: UserThread | null;
  setUserThread: (userThread: UserThread | null) => void;
  assistantId: string | null;
  setAssistantId: (assistantId: string | null) => void;
}

const useUserInfo = create(
  persist<UserInfoProps>(
    (set, get) => ({
      userThread: null,
      setUserThread: (userThread: UserThread | null) => {
        set({ userThread: userThread });
      },
      assistantId: null,
      setAssistantId: (assistantId: string | null) => {
        set({ assistantId: assistantId });
      },
    }),
    {
      name: "user-info-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserInfo;
