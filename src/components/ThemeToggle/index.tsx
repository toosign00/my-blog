'use client';

import { useTheme } from 'next-themes';
import { AfterMount } from '@/components/AfterMount';

export const ThemeToggle = () => {
  const { resolvedTheme: theme, setTheme } = useTheme();

  return (
    <AfterMount fallback={<div className='ui-button h4 w-full text-gray-accent' />}>
      <button
        aria-label='Toggle dark or light mode'
        className='ui-button h4 w-full text-gray-accent hover:bg-background02'
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        type='button'
      >
        <span aria-hidden='true'>{theme === 'light' ? '🌚' : '🌞'}</span>
        <span className='ml-1.5'>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
      </button>
    </AfterMount>
  );
};
