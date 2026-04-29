"use client";

import { useHasMounted } from "@hooks/useHasMounted";
import type { ReactNode } from "react";

export interface AfterMountProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AfterMount = ({ children, fallback }: AfterMountProps) => (
  <>{useHasMounted() ? children : fallback}</>
);
