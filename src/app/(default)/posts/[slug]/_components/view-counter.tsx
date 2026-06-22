'use client';

import { useEffect, useRef } from 'react';
import { useViewsMutation, useViewsQuery } from '@/hooks/useViews';

interface ViewCounterProps {
  pathname: string;
}

export const ViewCounter = ({ pathname }: ViewCounterProps) => {
  const hasCounted = useRef(false);
  const { data } = useViewsQuery(pathname);
  const { mutate } = useViewsMutation(pathname);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;
    mutate();
  }, [mutate]);

  return <span>{data ? data.total.toLocaleString() : '-'} views</span>;
};
