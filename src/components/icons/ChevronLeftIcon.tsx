import type { IconProps } from '@/types/icon.types';

export const ChevronLeftIcon = ({ size = 16, ...props }: IconProps) => (
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
    <title>Chevron left</title>
    <path d='m15 18-6-6 6-6' />
  </svg>
);

ChevronLeftIcon.displayName = 'ChevronLeftIcon';
