import type { PropsWithChildren } from 'react';

const WideLayout = ({ children }: PropsWithChildren) => {
  return <div className='w-full tablet:pl-sidebar'>{children}</div>;
};

export default WideLayout;
