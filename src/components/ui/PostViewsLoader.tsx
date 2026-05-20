'use client';

import { useEffect, useRef } from 'react';

interface PostViewsLoaderProps {
  slugs: string[];
  onLoad: (viewsMap: Record<string, number>) => void;
}

export const PostViewsLoader = ({ slugs, onLoad }: PostViewsLoaderProps) => {
  const onLoadRef = useRef(onLoad);
  onLoadRef.current = onLoad;

  const slugsKey = slugs.join(',');

  useEffect(() => {
    if (!slugsKey) return;

    const params = slugsKey
      .split(',')
      .map((s) => `slugs=${encodeURIComponent(s)}`)
      .join('&');

    fetch(`/api/views/bulk?${params}`)
      .then((r) => r.json())
      .then((data: Record<string, number>) => onLoadRef.current(data))
      .catch(() => undefined);
  }, [slugsKey]);

  return null;
};
