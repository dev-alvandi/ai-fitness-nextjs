"use client";

import { Fragment, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleThemeChange = () => {
    if (theme === "dark") {
      return setTheme("light");
    }
    setTheme("dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleThemeChange}
      className="duration-100"
    >
      {theme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-100 dark:-rotate-0 dark:scale-100" />
      ) : (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-100 dark:rotate-90 dark:scale-0" />
      )}
    </Button>
  );
}
