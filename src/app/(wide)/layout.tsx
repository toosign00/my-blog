import type { PropsWithChildren } from 'react';
import { Layout } from '@/components/layout/Root';

const WideLayout = ({ children }: PropsWithChildren) => {
  return <Layout variant='wide'>{children}</Layout>;
};

export default WideLayout;
