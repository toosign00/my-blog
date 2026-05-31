import type { SVGProps } from 'react';

export type IconProps = {
  size?: number | string;
} & Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>;
