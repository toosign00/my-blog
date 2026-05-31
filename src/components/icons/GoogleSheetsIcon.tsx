import type { IconProps } from '@/types/icon.types';

export const GoogleSheetsIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 100 100'
    width={size}
    height={size}
    aria-hidden='true'
    focusable='false'
    {...props}
  >
    <defs>
      <linearGradient id='google-sheet__a' x1={0} x2={1} y1={0} y2={0}>
        <stop offset='0%' stopColor='#6bc0ff' />
        <stop offset='100%' stopColor='#1ec970' stopOpacity={0.5} />
      </linearGradient>
    </defs>
    <path
      fill='#019c5a'
      d='M11 22.1c-5.1.3-9.1 4.8-9.1 9.8l-.1 35.6c0 5.6 4.3 10.5 8.8 10.6l.4.1 26-41.3z'
    />
    <path
      fill='#1ec970'
      d='M88.1 14.6H20.5c-5.8 0-10.6 4.8-10.6 10.8V75c.3 5.4 4.7 10.4 10.6 10.4h67.8c5.4 0 10-4.5 10-10.2V25.4c0-5.4-4.4-10.8-10.2-10.8'
    />
    <rect width={60} height={57} y={21.5} fill='url(#google-sheet__a)' rx={1} />
    <path
      fill='#fff'
      d='m88 60.5-8.3-.1V38.8c0-1.6-1.3-3.3-3.2-3.3s-3.3 1.6-3.3 3.3v21.6H41c-1.6 0-3.3 1.3-3.4 3.1 0 1.9 1.5 3.4 3.3 3.4h32.3v7.8c0 1.7 1.4 3.2 3.3 3.2 1.8 0 3.2-1.4 3.2-3.1v-7.9h8.4c1.5 0 3-1.4 3-3.3 0-1.5-1.4-3.1-3.1-3.1'
    />
  </svg>
);
