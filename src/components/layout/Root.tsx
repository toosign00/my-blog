'use client';

import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { ROUTES } from '@/constants/menu.constants';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith(ROUTES.PROJECTS);

  return (
    <div
      className={twMerge(
        'w-full h-full mx-auto pl-0 tablet:pl-sidebar',
        isProjectPage
          ? 'max-w-full desktop:max-w-full'
          : 'max-w-app tablet:max-w-[calc(var(--spacing-app)+var(--spacing-sidebar))] desktop:max-w-app desktop:pl-0'
      )}
    >
      <Sidebar />
      <Header />
      <main className='column pt-[2.65625rem] tablet:pt-25 pb-16.25' data-animate='true'>
        {children}
      </main>
    </div>
  );
};
