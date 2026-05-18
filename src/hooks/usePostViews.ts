'use client';

import { useEffect, useMemo, useState } from 'react';

type ViewsState = { status: 'loading' } | { status: 'done'; data: Record<string, number> };

export const usePostViews = (slugs: string[]): ViewsState => {
  const key = useMemo(() => slugs.join(','), [slugs]);
  const [state, setState] = useState<ViewsState>({ status: 'loading' });

  useEffect(() => {
    if (!key) {
      setState({ status: 'done', data: {} });
      return;
    }
    setState({ status: 'loading' });
    fetch(`/api/views?slugs=${key}`)
      .then((r) => r.json())
      .then((data) => setState({ status: 'done', data }))
      .catch((_e: unknown) => {
        setState({ status: 'done', data: {} });
      });
  }, [key]);

  return state;
};
