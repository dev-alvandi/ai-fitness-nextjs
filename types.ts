export interface ThreadMessageProps {
  assistant_id: string | null;
  attachments: [];
  content: {
    text: {
      value: string;
    };
    type: "text";
  }[];
  created_at: number;
  id: string;
  metadata: {
    fromUser?: string;
  };
  object: string;
  role: "user";
  run_id: string | null;
  thread_id: string;
}

export interface AssistantTableProps {
  id: string;
  assistantId: string;
}

export interface ChallengePreferencesTableProps {
  id?: string;
  userId: string;
  challengeId: string | "EASY" | "MEDIUM" | "HARD";
  sendNotifications?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
