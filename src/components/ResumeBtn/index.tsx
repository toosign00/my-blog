"use client";

import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { type ComponentProps, useState } from "react";
import { twMerge } from "tailwind-merge";

type ResumeDownloadButtonProps = {
  fileKey: string;
  children: React.ReactNode;
} & Omit<ComponentProps<"button">, "onClick" | "type">;

export const ResumeDownloadButton = ({
  fileKey,
  children,
  className,
  style,
  ...props
}: ResumeDownloadButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/r2?key=${encodeURIComponent(fileKey)}`,
      );
      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const data = await response.json();
      if (data.url) {
        window.open(data.url, "_blank");
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        void handleClick();
      }}
      className={twMerge("relative", className)}
      style={style}
      {...props}
    >
      <div
        className={`transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"}`}
      >
        {children}
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium text-sm">다운로드 중...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};
