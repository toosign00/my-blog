import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { queryD1 } from '@/utils/d1-util';
import { getVisitorStats } from '@/utils/stats-util';

const COUNT_INTERVAL_MS = 15 * 60 * 1000;
const LAST_COUNTED_COOKIE = 'stats_last_counted_at';

export async function GET() {
  try {
    return NextResponse.json(await getVisitorStats());
  } catch {
    return NextResponse.json({ today: 0, total: 0 }, { status: 500 });
  }
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const lastCountedAt = Number(cookieStore.get(LAST_COUNTED_COOKIE)?.value ?? '0');
    const now = Date.now();

    if (lastCountedAt > 0 && now - lastCountedAt < COUNT_INTERVAL_MS) {
      return NextResponse.json({ ok: true, counted: false });
    }

    const today = new Date().toISOString().slice(0, 10);

    await queryD1(
      `INSERT INTO page_views (date, pathname, count)
       VALUES (?, '/', 1)
       ON CONFLICT(date, pathname) DO UPDATE SET count = count + 1`,
      [today]
    );

    const response = NextResponse.json({ ok: true, counted: true });
    response.cookies.set({
      name: LAST_COUNTED_COOKIE,
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
