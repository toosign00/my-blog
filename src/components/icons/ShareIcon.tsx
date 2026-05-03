import type { IconProps } from '@/types/icon.types';

export const ShareIcon = ({ size = 16, ...props }: IconProps) => (
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
    <title>Share</title>
    <path d='M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8' />
    <polyline points='16 6 12 2 8 6' />
    <line x1='12' x2='12' y1='2' y2='15' />
  </svg>
);

ShareIcon.displayName = 'ShareIcon';
