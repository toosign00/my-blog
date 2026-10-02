'use client';

import { useEffect, useRef } from 'react';
import { useViewsMutation, useViewsQuery } from '@/hooks/useViews';

interface ViewCounterProps {
  pathname: string;
}

export const ViewCounter = ({ pathname }: ViewCounterProps) => {
  const hasCounted = useRef(false);
  const { mutate, isSuccess, isError } = useViewsMutation(pathname);
  // 방문 기록이 끝난 뒤 조회해야 N → N+1로 숫자가 바뀌지 않는다.
  const { data } = useViewsQuery(pathname, undefined, isSuccess || isError);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;
    mutate();
  }, [mutate]);

  return <span>{data ? data.total.toLocaleString() : '-'} views</span>;
};
