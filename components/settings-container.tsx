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
    level: "Enkel",
    description:
      "Denna utmaningsnivå är för personer som är nya på träning. Ta emot 3 utmaningar per dag (07:30, 12:00 och 17:30).",
  },
  {
    id: "MEDIUM",
    level: "Medel",
    description:
      "Denna utmaningsnivå är för personer som är bekanta med träning. Ta emot 4 utmaningar per dag (07:00, 12:00, 17:00 och 20:00).",
  },
  {
    id: "HARD",
    level: "Hård",
    description:
      "Denna utmaningsnivå är för personer som är erfarna med träning. Ta emot 5 utmaningar per dag (06:00, 09:00, 12:00, 17:00 och 20:00).",
  },
];

type Difficulties = "EASY" | "MEDIUM" | "HARD";

interface SettingsContainerProps {
  challengePreferences: ChallengePreferences;
}

function SettingsContainer({ challengePreferences }: SettingsContainerProps) {
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
        toast.error(res.data.message ?? "Fel vid sparande av utmaning");
        return;
      }

      toast.success("Inställningen sparad.");
    } catch (error) {
      console.error(error);
      toast.error("Något gick fel. Försök igen, tack.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col justify-between ">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Utmaningsnivå</h1>
        <Button onClick={handleSave}>{saving ? "Sparar..." : "Spara"}</Button>
      </div>
      <div className="flex flex-row items-center justify-between mb-4 p-4 shadow rounded-lg">
        {/* Push nofi */}
        <div className="">
          <h3 className="font-medium text-lg text-gray-900 dark:text-gray-100">
            Push meddelanden
          </h3>
          <p>Få push meddelanden när nya utmaningar är tillgängliga.</p>
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

export default SettingsContainer;
