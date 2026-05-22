import { getAllPosts } from '@/utils/post-util';
import { ViewsWidgetClient } from './ViewsWidgetClient';

export const ViewsWidget = async () => {
  const posts = await getAllPosts();
  return <ViewsWidgetClient postCount={posts.length} />;
};
