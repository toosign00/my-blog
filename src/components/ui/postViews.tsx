'use client';

import { useViewsQuery } from '@/hooks/useViews';

interface PostViewsProps {
  slug: string;
}

export const PostViews = ({ slug }: PostViewsProps) => {
  const { data } = useViewsQuery(`/posts/${slug}`);
  return (
    <span className='ml-4 tabular-nums'>{data ? data.total.toLocaleString() : '-'} views</span>
  );
};
