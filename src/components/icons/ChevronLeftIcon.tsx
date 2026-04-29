import type { SVGAttributes } from "react";

type IconProps = {
  size?: number;
  width?: number | string;
  height?: number | string;
} & SVGAttributes<SVGElement>;

export const ChevronLeftIcon = ({
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
    <title>Chevron left</title>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

ChevronLeftIcon.displayName = "ChevronLeftIcon";
