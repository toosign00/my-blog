import type { IconProps } from '@/types/icon.types';

export const ChromeIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='-13.73499479 -4.38055278 539.01318831 520.27162413'
    {...props}
  >
    <title>Chrome</title>
    <path d='m256 140h228a256 256 0 0 1 -240 371.7' fill='#fc4' />
    <path d='m357 314-113 197.7a256 256 0 0 1 -204-393.7' fill='#0f9d58' />
    <path d='m256 140h228a256 256 1 0 0 -444-22l115 196' fill='#db4437' />
    <circle cx='256' cy='256' fill='#4285f4' r='105' stroke='#f1f1f1' strokeWidth='24' />
  </svg>
);
