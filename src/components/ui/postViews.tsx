'use client';

import { usePostViews } from './postViewsProvider';

interface PostViewsProps {
  slug: string;
}

export const PostViews = ({ slug }: PostViewsProps) => {
  const views = usePostViews(slug);
  return (
    <span className='ml-4 tabular-nums'>{views ? views.total.toLocaleString() : '-'} views</span>
  );
};
