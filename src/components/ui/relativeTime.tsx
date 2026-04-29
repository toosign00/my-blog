"use client";

import { formatRelativeTime } from "@utils/date-util";
import type { ComponentProps } from "react";
import { AfterMount } from "@/components/AfterMount";

type RelativeTimeProps = ComponentProps<"time"> & {
  time: string | Date;
};

export const RelativeTime = ({ time, ...props }: RelativeTimeProps) => {
  return (
    <AfterMount>
      <time {...props}>{formatRelativeTime(time)}</time>
    </AfterMount>
  );
};
