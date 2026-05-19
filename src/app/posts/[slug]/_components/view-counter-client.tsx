'use client';

import { useEffect, useRef } from 'react';
import { useViewsMutation, useViewsQuery } from '@/hooks/useViews';
import type { Views } from '@/utils/stats-util';

interface ViewCounterClientProps {
  pathname: string;
  initialViews: Views;
}

export const ViewCounterClient = ({ pathname, initialViews }: ViewCounterClientProps) => {
  const hasCounted = useRef(false);
  const { data } = useViewsQuery(pathname, initialViews);
  const { mutate } = useViewsMutation(pathname);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;
    mutate();
  }, [mutate]);

  return <span>{data.total.toLocaleString()} views</span>;
};
