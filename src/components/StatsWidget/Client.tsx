'use client';

import { useEffect, useRef, useState } from 'react';

interface StatsWidgetClientProps {
  postCount: number;
  initialStats: Stats;
}

interface Stats {
  today: number;
  total: number;
}

const metricNumberStyle = { fontSize: '20px', letterSpacing: '-0.374px' } as const;

function useCountUp(target: number, duration = 1400) {
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

interface CountResponse {
  ok: boolean;
  counted?: boolean;
}

export const StatsWidgetClient = ({ postCount, initialStats }: StatsWidgetClientProps) => {
  const [stats, setStats] = useState<Stats>(initialStats);
  const hasCounted = useRef(false);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;

    void (async () => {
      const postRes = await fetch('/api/stats', { method: 'POST' });
      const postData = (await postRes.json()) as CountResponse;

      if (!postData.counted) {
        return;
      }

      setStats((prev) => ({ today: prev.today + 1, total: prev.total + 1 }));
    })();
  }, []);

  const todayCount = useCountUp(stats.today);
  const totalCount = useCountUp(stats.total);
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
          {todayCount.toLocaleString()}
        </span>
      </div>

      <div className='flex items-baseline justify-between border-b border-border py-3'>
        <span className='text-xs text-gray-light'>Total Visitors</span>
        <span className='font-semibold tabular-nums text-gray-accent' style={metricNumberStyle}>
          {totalCount.toLocaleString()}
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
