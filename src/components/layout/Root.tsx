'use client';

import { usePathname } from 'next/navigation';
import { type PropsWithChildren, ViewTransition } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  return (
    <div className='mx-auto h-full w-full max-w-full'>
      <Sidebar />
      <Header />
      <ViewTransition default='none' enter='page' exit='page' key={pathname}>
        <main className='column w-full pt-[2.65625rem] tablet:pt-25 pb-16.25'>{children}</main>
      </ViewTransition>
    </div>
  );
};
