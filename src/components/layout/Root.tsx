import { type PropsWithChildren, ViewTransition } from 'react';
import { twMerge } from 'tailwind-merge';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

type LayoutProps = PropsWithChildren<{
  variant?: 'default' | 'wide';
}>;

const CONTENT_CLASS = {
  default:
    'mx-auto w-full max-w-app tablet:max-w-[calc(var(--spacing-app)+var(--spacing-sidebar))] tablet:pl-sidebar desktop:max-w-app desktop:pl-0',
  wide: 'w-full tablet:pl-sidebar',
} as const;

export const Layout = ({ children, variant = 'default' }: LayoutProps) => {
  return (
    <div className='mx-auto h-full w-full max-w-full'>
      <Sidebar />
      <Header />
      <ViewTransition name='cross'>
        <main className='column w-full pt-[2.65625rem] tablet:pt-25 pb-16.25'>
          <div className={twMerge(CONTENT_CLASS[variant])}>{children}</div>
        </main>
      </ViewTransition>
    </div>
  );
};
