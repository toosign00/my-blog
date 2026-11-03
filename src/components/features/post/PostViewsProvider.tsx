'use client';

import { createContext, type PropsWithChildren, useContext } from 'react';
import { useBatchViewsQuery } from '@/hooks/useViews';
import type { Views } from '@/utils/views-util';

const PostViewsContext = createContext<Record<string, Views> | undefined>(undefined);

interface PostViewsProviderProps extends PropsWithChildren {
  slugs: readonly string[];
}

export const PostViewsProvider = ({ children, slugs }: PostViewsProviderProps) => {
  const pathnames = slugs.map((slug) => `/posts/${slug}`);
  const { data } = useBatchViewsQuery(pathnames);

  return <PostViewsContext value={data}>{children}</PostViewsContext>;
};

export const usePostViews = (slug: string) => {
  const views = useContext(PostViewsContext);
  return views?.[`/posts/${slug}`];
};
