import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Stats } from '@/utils/stats-util';

const statsQueryKey = (pathname: string) => ['stats', pathname];

const fetchStats = async (pathname: string): Promise<Stats> => {
  const res = await fetch(`/api/stats?pathname=${encodeURIComponent(pathname)}`);
  return res.json() as Promise<Stats>;
};

const postStats = async (pathname: string): Promise<{ ok: boolean; counted: boolean }> => {
  const res = await fetch('/api/stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pathname }),
  });
  return res.json() as Promise<{ ok: boolean; counted: boolean }>;
};

export function useStatsQuery(pathname: string, initialData: Stats) {
  return useQuery({
    queryKey: statsQueryKey(pathname),
    queryFn: () => fetchStats(pathname),
    initialData,
    staleTime: Infinity,
  });
}

export function useStatsMutation(pathname: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postStats(pathname),
    onSuccess: ({ counted }) => {
      if (counted) {
        void queryClient.invalidateQueries({ queryKey: statsQueryKey(pathname) });
      }
    },
  });
}
