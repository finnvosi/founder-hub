"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

function ThemeSync() {
  const { setTheme } = useTheme();
  const hasRun = React.useRef(false);

  React.useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // If there's no explicit user choice in localStorage,
    // ensure we're on "system" so the OS preference is respected.
    const stored = localStorage.getItem("theme");
    if (!stored || stored === "undefined") {
      setTheme("system");
    }
  }, [setTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
