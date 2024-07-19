"use client";

import { ChallengePreferencesTableProps } from "@/types";
import { ChallengePreferences } from "@prisma/client";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useState } from "react";
import DifficultyCard from "./difficulty-card";
import toast from "react-hot-toast";
import axios from "axios";

const difficulties = [
  {
    id: "EASY",
    level: "Easy",
    description:
      "This challenge level is for people who are new to programming. Receive 3 challenges per day (7:30AM, 12PM, & 5:30PM EST).",
  },
  {
    id: "MEDIUM",
    level: "Medium",
    description:
      "This challenge level is for people who are familiar with programming. Receive 4 challenges per day (7AM, 12PM, 5PM, & 8PM EST).",
  },
  {
    id: "HARD",
    level: "Hard",
    description:
      "This challenge level is for people who are experienced with programming. Receive 5 challenges per day (6AM, 9AM, 12PM, 5PM, & 8PM EST).",
  },
];

type Difficulties = "EASY" | "MEDIUM" | "HARD";

interface ProfileContainerProps {
  challengePreferences: ChallengePreferences;
}

function ProfileContainer({ challengePreferences }: ProfileContainerProps) {
  const [sendNotifications, setSendNotifications] = useState(
    challengePreferences.sendNotifications
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    challengePreferences.challengeId
  );
  const [saving, setSaving] = useState(false);

  const handleToggleNotifications = () => {
    setSendNotifications((prev) => !prev);
  };

  const handleSelectDifficulty = (difficultyId: Difficulties) => {
    setSelectedDifficulty(difficultyId);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await axios.post<{
        success: boolean;
        data?: ChallengePreferences;
        message?: string;
      }>("/api/challenge-preferences", {
        id: challengePreferences.id,
        challengeId: selectedDifficulty,
        sendNotifications,
      });

      if (!res.data.success || !res.data.data) {
        console.error(res.data.message);
        toast.error(res.data.message ?? "Error during saving challenge");
        return;
      }

      toast.success("Preference saved.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col justify-between ">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Challenge level</h1>
        <Button onClick={handleSave}>{saving ? "Saving..." : "Save"}</Button>
      </div>
      <div className="flex flex-row items-center justify-between mb-4 p-4 shadow rounded-lg">
        {/* Push nofi */}
        <div className="">
          <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
            Push Notifications
          </h3>
          <p>Receive push notifications when new challenges are available.</p>
        </div>
        <Switch
          checked={sendNotifications}
          onCheckedChange={handleToggleNotifications}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((difficulty) => (
          <DifficultyCard
            key={difficulty.id}
            level={difficulty.level}
            description={difficulty.description}
            selected={difficulty.id === selectedDifficulty}
            onSelect={handleSelectDifficulty.bind(
              null,
              difficulty.id as Difficulties
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default ProfileContainer;
