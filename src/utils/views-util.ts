import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { queryD1 } from '@/utils/d1-util';
import { mapBatchViews, type ViewCountRow } from '@/utils/views-batch-util';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface Views {
  today: number;
  total: number;
}

export function getTodayVisitDate() {
  return dayjs().tz('Asia/Seoul').format('YYYY-MM-DD');
}

export async function getViews(pathname = '/'): Promise<Views> {
  const rows = await queryD1<Views>(
    `SELECT 0 as today, total
     FROM page_view_counts
     WHERE pathname = ?`,
    [pathname]
  );
  return { today: rows[0]?.today ?? 0, total: rows[0]?.total ?? 0 };
}

export async function getBatchViews(pathnames: readonly string[]): Promise<Record<string, Views>> {
  const placeholders = pathnames.map(() => '?').join(', ');
  const rows = await queryD1<ViewCountRow>(
    `SELECT pathname, total
     FROM page_view_counts
     WHERE pathname IN (${placeholders})`,
    [...pathnames]
  );

  return mapBatchViews(pathnames, rows);
}

export async function getSiteVisits(): Promise<Views> {
  const today = getTodayVisitDate();
  const rows = await queryD1<Views>(
    `SELECT
      COALESCE(SUM(CASE WHEN visit_date = ? THEN total ELSE 0 END), 0) as today,
      COALESCE(SUM(total), 0) as total
    FROM daily_site_visit_counts`,
    [today]
  );
  return { today: rows[0]?.today ?? 0, total: rows[0]?.total ?? 0 };
}
