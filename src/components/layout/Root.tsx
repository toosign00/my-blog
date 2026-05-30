'use client';

import { usePathname } from 'next/navigation';
import { type PropsWithChildren, ViewTransition } from 'react';
import { twMerge } from 'tailwind-merge';
import { ROUTES } from '@/constants/menu.constants';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isProjectPage = pathname?.startsWith(ROUTES.PROJECTS);

  return (
    <div className='mx-auto h-full w-full max-w-full'>
      <Sidebar />
      <Header />
      <ViewTransition name='cross'>
        <main className='column w-full pt-[2.65625rem] tablet:pt-25 pb-16.25'>
          <div
            className={twMerge(
              isProjectPage
                ? 'w-full tablet:pl-sidebar'
                : 'mx-auto w-full max-w-app tablet:max-w-[calc(var(--spacing-app)+var(--spacing-sidebar))] tablet:pl-sidebar desktop:max-w-app desktop:pl-0'
            )}
          >
            {children}
          </div>
        </main>
      </ViewTransition>
    </div>
  );
};
