import type { ReactNode } from 'react';
import { chipClass } from '@/design-system/components/Chip';

interface SkillBadgeProps {
  icon: ReactNode | ReactNode[];
  label: string;
}

export const SkillBadge = ({ icon, label }: SkillBadgeProps) => {
  const icons = Array.isArray(icon) ? icon : [icon];
  return (
    <span className={chipClass({ size: 'lg', className: 'text-secondary' })}>
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
