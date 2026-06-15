import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Views } from '@/utils/views-util';

const SITE_VIEWS_KEY = '__site__';
const viewsQueryKey = (pathname?: string) => ['views', pathname ?? SITE_VIEWS_KEY];
const batchViewsQueryKey = (pathnames: readonly string[]) => ['views', 'batch', ...pathnames];

const fetchViews = async (pathname?: string): Promise<Views> => {
  const url = pathname
    ? `/api/views?pathname=${encodeURIComponent(pathname)}`
    : '/api/views?scope=all';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load views');
  }
  return res.json() as Promise<Views>;
};

const fetchBatchViews = async (pathnames: readonly string[]): Promise<Record<string, Views>> => {
  const params = new URLSearchParams({ pathnames: pathnames.join(',') });
  const res = await fetch(`/api/views?${params}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load views');
  }
  return res.json() as Promise<Record<string, Views>>;
};

const postViews = async (pathname: string): Promise<{ ok: boolean; counted: boolean }> => {
  const res = await fetch('/api/views', {
    method: 'POST',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pathname }),
  });
  if (!res.ok) {
    throw new Error('Failed to record view');
  }
  return res.json() as Promise<{ ok: boolean; counted: boolean }>;
};

export function useViewsQuery(pathname?: string, initialData?: Views) {
  return useQuery({
    queryKey: viewsQueryKey(pathname),
    queryFn: () => fetchViews(pathname),
    ...(initialData && { initialData }),
    gcTime: 0,
    refetchOnMount: 'always',
    staleTime: 0,
  });
}

export function useBatchViewsQuery(pathnames: readonly string[]) {
  return useQuery({
    queryKey: batchViewsQueryKey(pathnames),
    queryFn: () => fetchBatchViews(pathnames),
    enabled: pathnames.length > 0,
    gcTime: 0,
    refetchOnMount: 'always',
    staleTime: 0,
  });
}

export function useViewsMutation(pathname: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postViews(pathname),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: viewsQueryKey(pathname) });
      void queryClient.invalidateQueries({ queryKey: viewsQueryKey() });
    },
  });
}
