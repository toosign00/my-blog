import { getAllPosts } from '@/utils/post-util';
import { getViews } from '@/utils/views-util';
import { ViewsWidgetClient } from './ViewsWidgetClient';

export const ViewsWidget = async () => {
  const [posts, initialViews] = await Promise.all([getAllPosts(), getViews()]);
  return <ViewsWidgetClient postCount={posts.length} initialViews={initialViews} />;
};
