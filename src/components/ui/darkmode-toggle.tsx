"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      className="fixed top-4 right-4 z-50 bg-zinc-200 dark:bg-zinc-800 rounded-full p-2 shadow hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle dark mode"
    >
      {dark ? <Moon className="text-yellow-400" /> : <Sun className="text-blue-500" />}
    </button>
  );
}
