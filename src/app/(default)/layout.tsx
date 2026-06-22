import type { PropsWithChildren } from 'react';
import { Layout } from '@/components/layout/Root';

const DefaultLayout = ({ children }: PropsWithChildren) => {
  return <Layout variant='default'>{children}</Layout>;
};

export default DefaultLayout;
