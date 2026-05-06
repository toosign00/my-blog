import { queryD1 } from './d1-util';

interface CountRow {
  total: number;
}

export interface VisitorStats {
  today: number;
  total: number;
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const today = new Date().toISOString().slice(0, 10);

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
