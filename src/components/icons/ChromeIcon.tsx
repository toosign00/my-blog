import type { IconProps } from '@/types/icon.types';

export const ChromeIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='-13.735 -4.381 539.013 520.272'
    width={size}
    height={size}
    aria-hidden='true'
    focusable='false'
    {...props}
  >
    <path fill='#fc4' d='M256 140h228a256 256 0 0 1-240 371.7' />
    <path fill='#0f9d58' d='M357 314 244 511.7A256 256 0 0 1 40 118' />
    <path fill='#db4437' d='M256 140h228a256 256 1 0 0-444-22l115 196' />
    <circle cx={256} cy={256} r={105} fill='#4285f4' stroke='#f1f1f1' strokeWidth={24} />
  </svg>
);
