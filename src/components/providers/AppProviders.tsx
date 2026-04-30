"use client";

import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/toaster";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  );
};
