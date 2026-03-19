 "use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const effectiveTheme = resolvedTheme ?? theme;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => {
        // Cycle through: system -> light -> dark
        if (!theme || theme === "system") setTheme("light");
        else if (theme === "light") setTheme("dark");
        else setTheme("system");
      }}
      className="relative"
    >
      {effectiveTheme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : effectiveTheme === "light" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Monitor className="h-4 w-4" />
      )}
    </Button>
  );
}

