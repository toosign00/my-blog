import type { IconProps } from '@/types/icon.types';

export const ChevronRightIcon = ({ size = 16, ...props }: IconProps) => (
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
    <title>Chevron right</title>
    <path d='m9 18 6-6-6-6' />
  </svg>
);

ChevronRightIcon.displayName = 'ChevronRightIcon';
