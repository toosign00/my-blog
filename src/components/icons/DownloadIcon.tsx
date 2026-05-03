import type { IconProps } from '@/types/icon.types';

export const DownloadIcon = ({ size = 24, ...props }: IconProps) => (
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
    <title>Download</title>
    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
    <polyline points='7 10 12 15 17 10' />
    <line x1='12' x2='12' y1='15' y2='3' />
  </svg>
);

DownloadIcon.displayName = 'DownloadIcon';
