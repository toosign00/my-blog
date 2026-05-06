import type { ReactNode } from 'react';

interface SkillBadgeProps {
  icon: ReactNode | ReactNode[];
  label: string;
}

export const SkillBadge = ({ icon, label }: SkillBadgeProps) => {
  const icons = Array.isArray(icon) ? icon : [icon];
  return (
    <span className='ui-chip inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-gray-bold text-sm font-medium'>
      <span className='shrink-0 flex items-center gap-1'>
        {icons.map((ic, i) => (
          <span
            key={ic && typeof ic === 'object' && 'key' in ic && ic.key != null ? ic.key : i}
            className='flex items-center justify-center w-5 h-5'
          >
            {ic}
          </span>
        ))}
      </span>
      {label}
    </span>
  );
};
