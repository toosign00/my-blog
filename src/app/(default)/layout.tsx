import type { PropsWithChildren } from 'react';

const DefaultLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='mx-auto w-full max-w-app tablet:max-w-app-with-sidebar tablet:pl-sidebar desktop:max-w-app desktop:pl-0'>
      {children}
    </div>
  );
};

export default DefaultLayout;
