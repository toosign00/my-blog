'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type ViewsState = { status: 'loading' } | { status: 'done'; data: Record<string, number> };

export const usePostViews = (slugs: string[]): ViewsState => {
  const key = useMemo(() => slugs.join(','), [slugs]);
  const pathname = usePathname();
  const [state, setState] = useState<ViewsState>({ status: 'loading' });

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers refetch on navigation back to listing pages
  useEffect(() => {
    if (!key) {
      setState({ status: 'done', data: {} });
      return;
    }
    setState({ status: 'loading' });
    fetch(`/api/views?slugs=${key}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => setState({ status: 'done', data }))
      .catch((_e: unknown) => {
        setState({ status: 'done', data: {} });
      });
  }, [key, pathname]);

  return state;
};
