import type { ReactNode } from "react";

interface SkillBadgeProps {
  icon: ReactNode | ReactNode[];
  label: string;
}

export const SkillBadge = ({ icon, label }: SkillBadgeProps) => {
  const icons = Array.isArray(icon) ? icon : [icon];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm border border-border bg-background02 text-gray-bold text-sm font-medium hover:bg-background03 transition-colors">
      <span className="shrink-0 flex items-center gap-1">
        {icons.map((ic, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static icon list
          <span key={i} className="flex items-center justify-center w-5 h-5">
            {ic}
          </span>
        ))}
      </span>
      {label}
    </span>
  );
};
