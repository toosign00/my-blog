'use client';

import type { ReactNode } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';

export interface AfterMountProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AfterMount = ({ children, fallback }: AfterMountProps) => (
  <>{useHasMounted() ? children : fallback}</>
);
