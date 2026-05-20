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

export async function getViews(pathname = '/'): Promise<Views> {
  const todayStart = dayjs().tz('Asia/Seoul').startOf('day').unix();
  const rows = await queryD1<Views>(
    `SELECT
      COALESCE(SUM(CASE WHEN visited_at >= ? THEN 1 ELSE 0 END), 0) as today,
      COUNT(*) as total
    FROM page_views
    WHERE pathname = ?`,
    [todayStart, pathname]
  );
  return { today: rows[0]?.today ?? 0, total: rows[0]?.total ?? 0 };
}
