import { Suspense } from 'react';
import { getViews } from '@/utils/stats-util';
import { ViewCounterClient } from './view-counter-client';

interface ViewCounterProps {
  pathname: string;
}

const ViewCounterServer = async ({ pathname }: ViewCounterProps) => {
  const initialViews = await getViews(pathname);
  return <ViewCounterClient initialViews={initialViews} pathname={pathname} />;
};

export const ViewCounter = ({ pathname }: ViewCounterProps) => {
  return (
    <Suspense fallback={<span>- views</span>}>
      <ViewCounterServer pathname={pathname} />
    </Suspense>
  );
};
