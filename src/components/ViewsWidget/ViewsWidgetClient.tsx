'use client';

import { useEffect, useRef, useState } from 'react';
import { useViewsMutation, useViewsQuery } from '@/hooks/useViews';

interface ViewsWidgetClientProps {
  postCount: number;
}

const metricNumberStyle = { fontSize: '1.25rem', letterSpacing: '-0.375px' } as const;

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setValue(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}

export const ViewsWidgetClient = ({ postCount }: ViewsWidgetClientProps) => {
  const hasCounted = useRef(false);
  const { data: views } = useViewsQuery();
  const { mutate } = useViewsMutation('/');

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;
    mutate();
  }, [mutate]);

  const todayCount = useCountUp(views?.today ?? 0);
  const totalCount = useCountUp(views?.total ?? 0);
  const postCountAnimated = useCountUp(postCount, 800);

  return (
    <div className='flex h-full w-full flex-col justify-center px-5 py-5'>
      <div className='flex items-baseline justify-between border-b border-border py-3'>
        <div className='flex items-center gap-2'>
          <div
            className='h-1.5 w-1.5 rounded-full'
            style={{ backgroundColor: 'var(--color-primary)' }}
          />
          <span className='text-xs text-gray-light'>Today</span>
        </div>
        <span
          className='font-semibold tabular-nums'
          style={{ ...metricNumberStyle, color: 'var(--color-primary-focus)' }}
        >
          {views ? todayCount.toLocaleString() : '-'}
        </span>
      </div>

      <div className='flex items-baseline justify-between border-b border-border py-3'>
        <span className='text-xs text-gray-light'>Total Visits</span>
        <span className='font-semibold tabular-nums text-gray-accent' style={metricNumberStyle}>
          {views ? totalCount.toLocaleString() : '-'}
        </span>
      </div>

      <div className='flex items-baseline justify-between py-3'>
        <span className='text-xs text-gray-light'>Posts</span>
        <span className='font-semibold tabular-nums text-gray-accent' style={metricNumberStyle}>
          {postCountAnimated.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
