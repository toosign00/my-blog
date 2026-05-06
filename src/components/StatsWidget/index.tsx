import { getAllPosts } from '@/utils/post-util';
import { getVisitorStats } from '@/utils/stats-util';
import { StatsWidgetClient } from './Client';

export const StatsWidget = async () => {
  const [posts, initialStats] = await Promise.all([getAllPosts(), getVisitorStats()]);
  return <StatsWidgetClient initialStats={initialStats} postCount={posts.length} />;
};
