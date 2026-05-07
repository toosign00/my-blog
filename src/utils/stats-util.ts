import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { queryD1 } from '@/utils/d1-util';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface Stats {
  today: number;
  total: number;
}

export function getKstDateKey(date = new Date()): string {
  return dayjs(date).tz('Asia/Seoul').format('YYYY-MM-DD');
}

export async function getStats(pathname = '/'): Promise<Stats> {
  const today = getKstDateKey();
  const rows = await queryD1<Stats>(
    `SELECT
      COALESCE(SUM(CASE WHEN date = ? THEN count ELSE 0 END), 0) as today,
      COALESCE(SUM(count), 0) as total
    FROM page_views
    WHERE pathname = ?`,
    [today, pathname]
  );
  return { today: rows[0]?.today ?? 0, total: rows[0]?.total ?? 0 };
}

export async function getPostsViews(slugs: string[]): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  const placeholders = slugs.map(() => '?').join(', ');
  const pathnames = slugs.map((slug) => `/posts/${slug}`);
  const rows = await queryD1<{ pathname: string; total: number }>(
    `SELECT pathname, COALESCE(SUM(count), 0) as total
     FROM page_views
     WHERE pathname IN (${placeholders})
     GROUP BY pathname`,
    pathnames
  );
  return Object.fromEntries(rows.map((r) => [r.pathname, r.total]));
}
