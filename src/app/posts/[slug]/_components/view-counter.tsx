'use client';

import { useEffect, useRef } from 'react';
import { useViewsMutation, useViewsQuery } from '@/hooks/useViews';

interface ViewCounterProps {
  pathname: string;
  initialTotal: number;
}

export const ViewCounter = ({ pathname, initialTotal }: ViewCounterProps) => {
  const hasCounted = useRef(false);
  const { data } = useViewsQuery(pathname, { today: 0, total: initialTotal });
  const { mutate } = useViewsMutation(pathname);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;
    mutate();
  }, [mutate]);

  return <span>{data.total.toLocaleString()} views</span>;
};
