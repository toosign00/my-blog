import { type PropsWithChildren, ViewTransition } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='mx-auto h-full w-full max-w-full'>
      <Sidebar />
      <Header />
      <ViewTransition name='cross'>
        <main className='column w-full pt-10 pb-16 tablet:pt-24'>{children}</main>
      </ViewTransition>
    </div>
  );
};
