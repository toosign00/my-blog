import type { SVGAttributes } from "react";

type IconProps = {
  size?: number;
  width?: number | string;
  height?: number | string;
} & SVGAttributes<SVGElement>;

export const ShareIcon = ({
  size = 16,
  width,
  height,
  ...props
}: IconProps) => (
  <svg
    fill="none"
    height={height ?? size}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width={width ?? size}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Share</title>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" x2="12" y1="2" y2="15" />
  </svg>
);

ShareIcon.displayName = "ShareIcon";
