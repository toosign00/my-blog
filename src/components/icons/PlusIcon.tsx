import type { SVGAttributes } from "react";

type IconProps = {
  size?: number;
  width?: number | string;
  height?: number | string;
} & SVGAttributes<SVGElement>;

export const PlusIcon = ({ size = 16, width, height, ...props }: IconProps) => (
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
    <title>Plus</title>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

PlusIcon.displayName = "PlusIcon";
