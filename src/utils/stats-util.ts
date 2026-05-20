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

export async function getStats(pathname = '/'): Promise<Stats> {
  const todayStart = dayjs().tz('Asia/Seoul').startOf('day').unix();
  const rows = await queryD1<Stats>(
    `SELECT
      COALESCE(SUM(CASE WHEN visited_at >= ? THEN 1 ELSE 0 END), 0) as today,
      COUNT(*) as total
    FROM page_views
    WHERE pathname = ?`,
    [todayStart, pathname]
  );
  return { today: rows[0]?.today ?? 0, total: rows[0]?.total ?? 0 };
}

export async function getPostsViews(slugs: string[]): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};
  const placeholders = slugs.map(() => '?').join(', ');
  const pathnames = slugs.map((slug) => `/posts/${slug}`);
  const rows = await queryD1<{ pathname: string; total: number }>(
    `SELECT pathname, COUNT(*) as total
     FROM page_views
     WHERE pathname IN (${placeholders})
     GROUP BY pathname`,
    pathnames
  );
  return Object.fromEntries(rows.map((r) => [r.pathname, r.total]));
}
