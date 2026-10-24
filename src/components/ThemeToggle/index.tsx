'use client';

import { useTheme } from 'next-themes';
import { AfterMount } from '@/components/AfterMount';
import { Button, buttonClass } from '@/design-system/components/Button';

export const ThemeToggle = () => {
  const { resolvedTheme: theme, setTheme } = useTheme();

  return (
    <AfterMount fallback={<div className={buttonClass({ className: 'w-full' })} />}>
      <Button
        aria-label='Toggle dark or light mode'
        className='w-full gap-0'
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        <span aria-hidden='true'>{theme === 'light' ? '🌚' : '🌞'}</span>
        <span className='ml-1.5'>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
      </Button>
    </AfterMount>
  );
};
