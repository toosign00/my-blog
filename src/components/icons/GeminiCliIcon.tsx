import type { IconProps } from '@/types/icon.types';

export const GeminiCliIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 256 256'
    width={size}
    height={size}
    aria-hidden='true'
    focusable='false'
    {...props}
  >
    <path
      fill='url(#gemini-cli__paint0_linear_1238_6151)'
      d='M45.8.09h164.1c25.35 0 45.83 20.72 45.83 46.3v163.1c0 25.58-21 46.33-46.48 46.33H46.05c-25.48 0-45.99-21.16-45.99-46.3V46.62C.06 20.85 20.81.1 45.82.1z'
    />
    <path
      fill='#1f1d2e'
      d='M46.82 14.06h161.9c18.49 0 32.5 15.43 32.5 33.06v161.8c0 18.33-14.53 32.49-32.56 32.49H46.96c-18.03 0-32.86-13.85-32.86-32.27V46.74c0-17.66 14.43-32.61 32.76-32.61z'
    />
    <path
      fill='url(#gemini-cli__paint1_linear_1238_6151)'
      d='m76.93 62.08 102.2 49.64v38.76l-102.4 49.43v-28.46l82.28-40.62-82.06-39.3V62.08z'
    />
    <defs>
      <linearGradient
        id='gemini-cli__paint0_linear_1238_6151'
        x1={10.83}
        x2={245.5}
        y1={24.31}
        y2={238.7}
        gradientUnits='userSpaceOnUse'
      >
        <stop offset={0} stopColor='#0083ff' />
        <stop offset={0.23} stopColor='#2384ff' />
        <stop offset={0.41} stopColor='#0186ff' />
        <stop offset={0.59} stopColor='#a774db' />
        <stop offset={0.83} stopColor='#e0597a' />
        <stop offset={1} stopColor='#e0597a' />
      </linearGradient>
      <linearGradient
        id='gemini-cli__paint1_linear_1238_6151'
        x1={71.54}
        x2={162.7}
        y1={100.5}
        y2={151.2}
        gradientUnits='userSpaceOnUse'
      >
        <stop offset={0} stopColor='#0186ff' />
        <stop offset={0.5} stopColor='#0186ff' />
        <stop offset={0.96} stopColor='#b878d6' />
      </linearGradient>
    </defs>
  </svg>
);
