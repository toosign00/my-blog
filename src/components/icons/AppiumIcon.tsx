import type { IconProps } from '@/types/icon.types';

export const AppiumIcon = ({ size = 24, ...props }: IconProps) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 136 136'
    width={size}
    height={size}
    aria-hidden='true'
    focusable='false'
    {...props}
  >
    <path
      fill='#FDBB11'
      d='M100.183 61.99a68 68 0 0 1-2.686 5.671 67.8 67.8 0 0 0-44.371-25.369A68.4 68.4 0 0 0 .895 57.215C6.764 20.205 41.585-5.065 78.694.905a67.8 67.8 0 0 1 21.092 6.964 68 68 0 0 1 3.581 10.048 67.8 67.8 0 0 1-2.985 44.073z'
    />
    <path
      fill='#61C3DA'
      d='M91.927 131.431C56.808 144.663 17.609 126.954 4.377 91.835A67.5 67.5 0 0 1 0 71.34h.099A67.6 67.6 0 0 1 37.905 45.075a70 70 0 0 1 14.923-2.288c-13.928 34.82 3.084 74.318 37.905 88.246l1.094.498z'
    />
    <path
      fill='#ED366D'
      d='M135.901 67.96a67.7 67.7 0 0 1-31.637 57.404 67.7 67.7 0 0 1-47.456-26.663 65 65 0 0 1-3.581-5.173c37.208-4.974 63.274-39.198 58.299-76.307l-.199-1.592a67.6 67.6 0 0 1 24.674 52.331z'
    />
    <path
      fill='url(#appium-a)'
      d='M135.901 67.96a67.7 67.7 0 0 1-31.637 57.404 67.7 67.7 0 0 1-47.456-26.663 65 65 0 0 1-3.581-5.173c32.433 10.147 67.452-5.273 81.779-36.114.597 3.482.796 6.964.796 10.546z'
    />
    <path
      fill='#61C3DA'
      d='M31.639 88.85a67.5 67.5 0 0 0 12.436 42.68C18.507 121.88 1.196 98.003.102 70.743v.498a67.65 67.65 0 0 1 52.728-28.454A67.6 67.6 0 0 0 31.539 88.85z'
    />
    <path
      fill='url(#appium-b)'
      d='M31.639 88.85a67.5 67.5 0 0 0 12.436 42.68C18.507 121.88 1.196 98.003.102 70.743v.498a67.65 67.65 0 0 1 52.728-28.454A67.6 67.6 0 0 0 31.539 88.85z'
    />
    <path
      fill='url(#appium-c)'
      d='M100.181 61.99a68 68 0 0 1-2.686 5.67c-7.76-33.229-38.9-55.514-72.726-52.131 21.091-17.411 50.639-20.495 74.915-7.661a68 68 0 0 1 3.581 10.048 67.8 67.8 0 0 1-2.984 44.073z'
    />
    <defs>
      <linearGradient
        id='appium-a'
        x1={133.016}
        x2={30.543}
        y1={86.664}
        y2={122.877}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#EE376D' stopOpacity={0} />
        <stop offset={0.1} stopColor='#E9376D' stopOpacity={0} />
        <stop offset={0.4} stopColor='#DC386E' stopOpacity={0.2} />
        <stop offset={0.7} stopColor='#C6396F' stopOpacity={0.5} />
        <stop offset={1} stopColor='#AC3B70' stopOpacity={0.8} />
      </linearGradient>
      <linearGradient
        id='appium-b'
        x1={17.611}
        x2={47.458}
        y1={116.408}
        y2={15.925}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#65C9D3' stopOpacity={0} />
        <stop offset={1} stopColor='#65C9D3' />
      </linearGradient>
      <linearGradient
        id='appium-c'
        x1={24.77}
        x2={105.653}
        y1={33.834}
        y2={33.834}
        gradientUnits='userSpaceOnUse'
      >
        <stop stopColor='#FFCB04' stopOpacity={0} />
        <stop offset={0.3} stopColor='#FFCB04' stopOpacity={0.2} />
        <stop offset={0.6} stopColor='#FFCB04' stopOpacity={0.5} />
        <stop offset={0.9} stopColor='#FFCB04' stopOpacity={0.9} />
        <stop offset={1} stopColor='#FFCB04' />
      </linearGradient>
    </defs>
  </svg>
);
