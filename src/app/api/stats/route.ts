import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { queryD1 } from '@/utils/d1-util';
import { getKstDateKey, getStats } from '@/utils/stats-util';

const COUNT_INTERVAL_MS = 15 * 60 * 1000;
const LAST_COUNTED_COOKIE = 'stats_last_counted_at';

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

    const cookieStore = await cookies();
    const cookieKey = `${LAST_COUNTED_COOKIE}_${pathname.replace(/\//g, '_')}`;
    const lastCountedAt = Number(cookieStore.get(cookieKey)?.value ?? '0');
    const now = Date.now();

    if (lastCountedAt > 0 && now - lastCountedAt < COUNT_INTERVAL_MS) {
      return NextResponse.json({ ok: true, counted: false });
    }

    const today = getKstDateKey();

    await queryD1(
      `INSERT INTO page_views (date, pathname, count)
       VALUES (?, ?, 1)
       ON CONFLICT(date, pathname) DO UPDATE SET count = count + 1`,
      [today, pathname]
    );

    const response = NextResponse.json({ ok: true, counted: true });
    response.cookies.set({
      name: cookieKey,
      value: String(now),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
