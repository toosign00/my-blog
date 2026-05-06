import { NextResponse } from 'next/server';
import { queryD1 } from '@/utils/d1-util';

interface CountRow {
  total: number;
}

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [todayRows, totalRows] = await Promise.all([
      queryD1<CountRow>('SELECT COALESCE(SUM(count), 0) as total FROM page_views WHERE date = ?', [
        today,
      ]),
      queryD1<CountRow>('SELECT COALESCE(SUM(count), 0) as total FROM page_views', []),
    ]);

    return NextResponse.json({
      today: todayRows[0]?.total ?? 0,
      total: totalRows[0]?.total ?? 0,
    });
  } catch {
    return NextResponse.json({ today: 0, total: 0 }, { status: 500 });
  }
}

export async function POST() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    await queryD1(
      `INSERT INTO page_views (date, pathname, count)
       VALUES (?, '/', 1)
       ON CONFLICT(date, pathname) DO UPDATE SET count = count + 1`,
      [today]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
