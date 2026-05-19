'use client';

import { useEffect } from 'react';

interface PostViewsLoaderProps {
  slugs: string[];
  onLoad: (viewsMap: Record<string, number>) => void;
}

export const PostViewsLoader = ({ slugs, onLoad }: PostViewsLoaderProps) => {
  useEffect(() => {
    if (slugs.length === 0) return;

    const params = slugs.map((s) => `slugs=${encodeURIComponent(s)}`).join('&');

    fetch(`/api/views/bulk?${params}`)
      .then((r) => r.json())
      .then((data: Record<string, number>) => onLoad(data))
      .catch(() => undefined);
  }, [slugs, onLoad]);

  return null;
};
