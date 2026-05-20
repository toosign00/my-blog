import { type NextRequest, NextResponse } from 'next/server';
import { queryD1 } from '@/utils/d1-util';
import { getStats } from '@/utils/stats-util';

const INTERVAL_MS = 30 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.searchParams.get('pathname') ?? '/';
    const stats = await getStats(pathname);
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ today: 0, total: 0 }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const pathname: string = body.pathname ?? '/';

    const ip = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();

    if (ip === '127.0.0.1' || ip === '::1') {
      return NextResponse.json({ ok: true, counted: false });
    }

    const cutoff = Math.floor((Date.now() - INTERVAL_MS) / 1000);

    const recent = await queryD1<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM page_views WHERE ip = ? AND pathname = ? AND visited_at >= ?`,
      [ip, pathname, cutoff]
    );

    if ((recent[0]?.cnt ?? 0) > 0) {
      return NextResponse.json({ ok: true, counted: false });
    }

    const now = Math.floor(Date.now() / 1000);
    await queryD1(`INSERT INTO page_views (ip, pathname, visited_at) VALUES (?, ?, ?)`, [
      ip,
      pathname,
      now,
    ]);

    return NextResponse.json({ ok: true, counted: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
