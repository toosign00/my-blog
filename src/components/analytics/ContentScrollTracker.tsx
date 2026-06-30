'use client';

import { useEffect } from 'react';
import { track } from '@/utils/analytics-util';

type ContentScrollTrackerProps = {
  contentType: 'post' | 'project';
  slug: string;
};

const THRESHOLDS = [25, 50, 75, 100] as const;

export const ContentScrollTracker = ({ contentType, slug }: ContentScrollTrackerProps) => {
  useEffect(() => {
    const reached = new Set<number>();

    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const depth = scrollable <= 0 ? 100 : Math.min(100, (window.scrollY / scrollable) * 100);

      for (const threshold of THRESHOLDS) {
        if (depth < threshold || reached.has(threshold)) continue;

        reached.add(threshold);
        track('content_scroll', {
          content_type: contentType,
          slug,
          depth: threshold,
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentType, slug]);

  return null;
};
