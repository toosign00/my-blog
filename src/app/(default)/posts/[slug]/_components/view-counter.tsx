'use client';

import { useEffect, useRef } from 'react';
import { useViewsMutation, useViewsQuery } from '@/hooks/useViews';

interface ViewCounterProps {
  pathname: string;
}

export const ViewCounter = ({ pathname }: ViewCounterProps) => {
  const hasCounted = useRef(false);
  const { mutate, isError } = useViewsMutation(pathname);
  // 방문 기록 응답이 이번 방문을 포함한 값을 채운다. 기록이 실패했을 때만 따로 조회한다.
  const { data } = useViewsQuery(pathname, undefined, isError);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;
    mutate();
  }, [mutate]);

  return <span>{data ? data.total.toLocaleString() : '-'} views</span>;
};
