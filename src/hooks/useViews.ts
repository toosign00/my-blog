import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Views } from '@/utils/views-util';

const SITE_VIEWS_KEY = '__site__';
const viewsQueryKey = (pathname?: string) => ['views', pathname ?? SITE_VIEWS_KEY];
const batchViewsQueryKey = (pathnames: readonly string[]) => ['views', 'batch', ...pathnames];

const fetchViews = async (pathname?: string): Promise<Views> => {
  const url = pathname
    ? `/api/views?pathname=${encodeURIComponent(pathname)}`
    : '/api/views?scope=all';
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error('Failed to load views');
  }
  return res.json() as Promise<Views>;
};

const fetchBatchViews = async (pathnames: readonly string[]): Promise<Record<string, Views>> => {
  const params = new URLSearchParams({ pathnames: pathnames.join(',') });
  const res = await fetch(`/api/views?${params}`, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error('Failed to load views');
  }
  return res.json() as Promise<Record<string, Views>>;
};

interface RecordViewsResponse {
  ok: boolean;
  counted: boolean;
  site: Views;
  page: Views;
}

const postViews = async (pathname: string): Promise<RecordViewsResponse> => {
  const res = await fetch('/api/views', {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pathname }),
  });
  if (!res.ok) {
    throw new Error('Failed to record view');
  }
  return res.json() as Promise<RecordViewsResponse>;
};

export function useViewsQuery(pathname?: string, initialData?: Views, enabled = true) {
  return useQuery({
    queryKey: viewsQueryKey(pathname),
    queryFn: () => fetchViews(pathname),
    enabled,
    ...(initialData && { initialData }),
    refetchOnMount: 'always',
    staleTime: 0,
  });
}

export function useBatchViewsQuery(pathnames: readonly string[]) {
  return useQuery({
    queryKey: batchViewsQueryKey(pathnames),
    queryFn: () => fetchBatchViews(pathnames),
    enabled: pathnames.length > 0,
    refetchOnMount: 'always',
    staleTime: 0,
  });
}

export function useViewsMutation(pathname: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postViews(pathname),
    // The response already has the updated counts, so no follow-up GET is needed.
    onSuccess: ({ site, page }) => {
      queryClient.setQueryData(viewsQueryKey(pathname), page);
      queryClient.setQueryData(viewsQueryKey(), site);
    },
  });
}
