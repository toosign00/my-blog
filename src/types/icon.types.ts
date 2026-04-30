import type { SVGAttributes } from "react";

export type IconProps = {
  size?: number;
} & Omit<SVGAttributes<SVGElement>, "width" | "height">;
