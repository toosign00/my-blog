import { getPostsViews } from '@/utils/stats-util';

export const PostViewCount = async ({ slug }: { slug: string }) => {
  const views = await getPostsViews([slug]);
  const count = views[`/posts/${slug}`] ?? 0;
  return <span className='ml-4 tabular-nums'>{count.toLocaleString()} views</span>;
};
