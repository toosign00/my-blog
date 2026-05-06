import { queryD1 } from './d1-util';

interface CountRow {
  total: number;
}

export interface VisitorStats {
  today: number;
  total: number;
}

export function getKstDateKey(date = new Date()): string {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const today = getKstDateKey();

  const [todayRows, totalRows] = await Promise.all([
    queryD1<CountRow>('SELECT COALESCE(SUM(count), 0) as total FROM page_views WHERE date = ?', [
      today,
    ]),
    queryD1<CountRow>('SELECT COALESCE(SUM(count), 0) as total FROM page_views', []),
  ]);

  return {
    today: todayRows[0]?.total ?? 0,
    total: totalRows[0]?.total ?? 0,
  };
}
