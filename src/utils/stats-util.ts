import { queryD1 } from '@/utils/d1-util';

export interface Stats {
  today: number;
  total: number;
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export function getKstDateKey(date = new Date()): string {
  return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

export async function getStats(): Promise<Stats> {
  const today = getKstDateKey();
  const rows = await queryD1<Stats>(
    `SELECT
      COALESCE(SUM(CASE WHEN date = ? THEN count ELSE 0 END), 0) as today,
      COALESCE(SUM(count), 0) as total
    FROM page_views`,
    [today]
  );
  return { today: rows[0]?.today ?? 0, total: rows[0]?.total ?? 0 };
}
