'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      position='bottom-center'
      duration={2000}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  );
}
