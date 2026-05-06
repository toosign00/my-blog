import { getAllPosts } from '@/utils/post-util';
import { StatsWidgetClient } from './Client';

export const StatsWidget = async () => {
  const posts = await getAllPosts();
  return <StatsWidgetClient postCount={posts.length} />;
};
