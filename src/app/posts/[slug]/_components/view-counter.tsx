'use client';

import { useEffect, useRef } from 'react';
import { useStatsMutation, useStatsQuery } from '@/hooks/useStats';

interface ViewCounterProps {
  pathname: string;
  initialTotal: number;
}

export const ViewCounter = ({ pathname, initialTotal }: ViewCounterProps) => {
  const hasCounted = useRef(false);
  const { data } = useStatsQuery(pathname, { today: 0, total: initialTotal });
  const { mutate } = useStatsMutation(pathname);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;
    mutate();
  }, [mutate]);

  return <span>{data.total.toLocaleString()} views</span>;
};
