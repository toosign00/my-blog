import { Suspense } from 'react';
import { getAllPosts } from '@/utils/post-util';
import { getViews } from '@/utils/stats-util';
import { StatsWidgetClient } from './StatsWidgetClient';

const StatsWidgetServer = async () => {
  const [posts, initialViews] = await Promise.all([getAllPosts(), getViews()]);
  return <StatsWidgetClient postCount={posts.length} initialViews={initialViews} />;
};

export const StatsWidget = () => {
  return (
    <Suspense fallback={<div className='h-full w-full' />}>
      <StatsWidgetServer />
    </Suspense>
  );
};
