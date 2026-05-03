import type { IconProps } from '@/types/icon.types';

export const PlusIcon = ({ size = 16, ...props }: IconProps) => (
  <svg
    fill='none'
    stroke='currentColor'
    strokeLinecap='round'
    strokeLinejoin='round'
    strokeWidth='2'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
    height={size}
    width={size}
  >
    <title>Plus</title>
    <path d='M5 12h14' />
    <path d='M12 5v14' />
  </svg>
);

PlusIcon.displayName = 'PlusIcon';
