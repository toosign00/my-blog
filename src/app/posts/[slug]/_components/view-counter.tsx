'use client';

import { useEffect, useRef } from 'react';
import { useStatsMutation, useStatsQuery } from '@/hooks/useStats';

interface ViewCounterProps {
  pathname: string;
}

export const ViewCounter = ({ pathname }: ViewCounterProps) => {
  const hasCounted = useRef(false);
  const { data } = useStatsQuery(pathname);
  const { mutate } = useStatsMutation(pathname);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;
    mutate();
  }, [mutate]);

  return <span>{data?.total != null ? data.total.toLocaleString() : '-'} views</span>;
};
