import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
}

export const Section = ({ title, children }: SectionProps) => (
  <div className="grid grid-cols-[7rem_1fr] gap-x-8 gap-y-4 border-t border-[var(--color-border)] pt-6">
    <p className="h6 font-medium text-[var(--color-gray-light)] pt-0.5">
      {title}
    </p>
    <div className="column gap-5">{children}</div>
  </div>
);
