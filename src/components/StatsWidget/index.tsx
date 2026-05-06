import { getAllPosts } from '@/utils/post-util';
import { getStats } from '@/utils/stats-util';
import { StatsWidgetClient } from './StatsWidgetClient';

export const StatsWidget = async () => {
  const [posts, initialStats] = await Promise.all([getAllPosts(), getStats()]);
  return <StatsWidgetClient postCount={posts.length} initialStats={initialStats} />;
};
