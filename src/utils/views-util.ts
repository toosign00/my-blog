import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { type D1Statement, queryD1, queryD1Batch } from '@/utils/d1-util';
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

const pageViewsStatement = (pathname: string): D1Statement => ({
  sql: `SELECT 0 as today, total
     FROM page_view_counts
     WHERE pathname = ?`,
  params: [pathname],
});

const siteVisitsStatement = (): D1Statement => ({
  sql: `SELECT
      COALESCE(SUM(CASE WHEN visit_date = ? THEN total ELSE 0 END), 0) as today,
      COALESCE(SUM(total), 0) as total
    FROM daily_site_visit_counts`,
  params: [getTodayVisitDate()],
});

const toViews = (rows: readonly Partial<Views>[]): Views => ({
  today: rows[0]?.today ?? 0,
  total: rows[0]?.total ?? 0,
});

export async function getViews(pathname = '/'): Promise<Views> {
  const { sql, params } = pageViewsStatement(pathname);
  return toViews(await queryD1<Views>(sql, params));
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
  const { sql, params } = siteVisitsStatement();
  return toViews(await queryD1<Views>(sql, params));
}

export interface RecordedVisit {
  counted: boolean;
  site: Views;
  page: Views;
}

// One D1 request records the visit and reads the updated counts. Each count is
// raised only when the visitor has no record in the window, and the counts run
// before the visitor records so they see the state from before this visit.
export async function recordVisit(
  visitorKey: string,
  pathname: string,
  windowMs: number,
  shouldRecord = true
): Promise<RecordedVisit> {
  const now = Math.floor(Date.now() / 1000);
  const cutoff = Math.floor((Date.now() - windowMs) / 1000);
  const writes: D1Statement[] = [
    {
      sql: `INSERT INTO daily_site_visit_counts (visit_date, total)
       SELECT ?, 1
       WHERE NOT EXISTS (
         SELECT 1 FROM recent_site_visitors WHERE visitor_key = ? AND visited_at >= ?
       )
       ON CONFLICT(visit_date) DO UPDATE SET total = total + 1`,
      params: [getTodayVisitDate(), visitorKey, cutoff],
    },
    {
      sql: `INSERT INTO page_view_counts (pathname, total, updated_at)
       SELECT ?, 1, ?
       WHERE NOT EXISTS (
         SELECT 1 FROM recent_page_viewers
         WHERE visitor_key = ? AND pathname = ? AND visited_at >= ?
       )
       ON CONFLICT(pathname) DO UPDATE SET
         total = total + 1,
         updated_at = excluded.updated_at
       RETURNING 1 as counted`,
      params: [pathname, now, visitorKey, pathname, cutoff],
    },
    {
      sql: `INSERT INTO recent_site_visitors (visitor_key, visited_at)
       VALUES (?, ?)
       ON CONFLICT(visitor_key) DO UPDATE SET visited_at = excluded.visited_at
       WHERE visited_at < ?`,
      params: [visitorKey, now, cutoff],
    },
    {
      sql: `INSERT INTO recent_page_viewers (visitor_key, pathname, visited_at)
       VALUES (?, ?, ?)
       ON CONFLICT(visitor_key, pathname) DO UPDATE SET visited_at = excluded.visited_at
       WHERE visited_at < ?`,
      params: [visitorKey, pathname, now, cutoff],
    },
    { sql: `DELETE FROM recent_site_visitors WHERE visited_at < ?`, params: [cutoff] },
    { sql: `DELETE FROM recent_page_viewers WHERE visited_at < ?`, params: [cutoff] },
  ];
  const statements = [
    ...(shouldRecord ? writes : []),
    siteVisitsStatement(),
    pageViewsStatement(pathname),
  ];
  const results = await queryD1Batch(statements);
  const [site, page] = results.slice(-2) as Partial<Views>[][];

  return {
    counted: shouldRecord && results[1].length > 0,
    site: toViews(site),
    page: toViews(page),
  };
}
