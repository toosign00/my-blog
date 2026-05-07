'use client';

import { Eye } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ViewCounterProps {
  pathname: string;
  initialTotal: number;
}

export const ViewCounter = ({ pathname, initialTotal }: ViewCounterProps) => {
  const hasCounted = useRef(false);

  useEffect(() => {
    if (hasCounted.current) return;
    hasCounted.current = true;
    void fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pathname }),
    });
  }, [pathname]);

  return (
    <span className='center-y gap-1'>
      <Eye size={12} />
      {initialTotal.toLocaleString()}
    </span>
  );
};
