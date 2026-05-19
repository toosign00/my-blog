import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { queryD1 } from '@/utils/d1-util';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface Views {
  today: number;
  total: number;
}

export function getKstDateKey(date = new Date()): string {
  return dayjs(date).tz('Asia/Seoul').format('YYYY-MM-DD');
}

export async function getViews(pathname = '/'): Promise<Views> {
  const today = getKstDateKey();
  const rows = await queryD1<Views>(
    `SELECT
      COALESCE(SUM(CASE WHEN date = ? THEN count ELSE 0 END), 0) as today,
      COALESCE(SUM(count), 0) as total
    FROM page_views
    WHERE pathname = ?`,
    [today, pathname]
  );
  return { today: rows[0]?.today ?? 0, total: rows[0]?.total ?? 0 };
}
