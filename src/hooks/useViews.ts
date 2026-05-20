import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Views } from '@/utils/views-util';

const viewsQueryKey = (pathname: string) => ['views', pathname];

const fetchViews = async (pathname: string): Promise<Views> => {
  const res = await fetch(`/api/views?pathname=${encodeURIComponent(pathname)}`);
  return res.json() as Promise<Views>;
};

const postViews = async (pathname: string): Promise<{ ok: boolean; counted: boolean }> => {
  const res = await fetch('/api/views', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pathname }),
  });
  return res.json() as Promise<{ ok: boolean; counted: boolean }>;
};

export function useViewsQuery(pathname: string, initialData: Views) {
  return useQuery({
    queryKey: viewsQueryKey(pathname),
    queryFn: () => fetchViews(pathname),
    initialData,
    staleTime: 60_000,
  });
}

export function useViewsMutation(pathname: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postViews(pathname),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: viewsQueryKey(pathname) });
    },
  });
}
