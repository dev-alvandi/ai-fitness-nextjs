"use client";

import { cn } from "@/lib/utils";

interface DifficultyCardProps {
  level: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

const selectedCardStyle = "ring-2 ring-hero bg-hero bg-opacity-10";
const unSelectedCardStyle = "hover:bg-gray-100 dark:hover:bg-gray-900";

const DifficultyCard = ({
  level,
  description,
  selected,
  onSelect,
}: DifficultyCardProps) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "flex flex-col p-4 border border-gray-200 rounded-lg cursor-pointer",
        selected ? selectedCardStyle : unSelectedCardStyle
      )}
    >
      <h2
        className={cn(
          "font-bold text-xl text-black dark:text-white",
          selected && "text-hero"
        )}
      >
        {level}
      </h2>
      <p className="text-gray-500 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default DifficultyCard;
