import { type NextRequest, NextResponse } from 'next/server';
import { queryD1 } from '@/utils/d1-util';
import { getSiteVisits, getViews } from '@/utils/views-util';

const INTERVAL_MS = 30 * 60 * 1000;
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store, max-age=0' };
const VISITOR_COOKIE = 'views_visitor_id';

const getClientIp = (request: NextRequest) => {
  const header =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('x-vercel-forwarded-for') ??
    request.headers.get('x-forwarded-for') ??
    '127.0.0.1';

  return header.split(',')[0].trim();
};

const getVisitor = (request: NextRequest) => {
  const visitorId = request.cookies.get(VISITOR_COOKIE)?.value;

  if (visitorId) {
    return { key: `visitor:${visitorId}`, shouldSetCookie: false, visitorId };
  }

  const nextVisitorId = crypto.randomUUID();
  return { key: `visitor:${nextVisitorId}`, shouldSetCookie: true, visitorId: nextVisitorId };
};

const recordSiteVisit = async (visitorKey: string, cutoff: number, now: number) => {
  const recent = await queryD1<{ cnt: number }>(
    `SELECT COUNT(*) as cnt FROM site_visits WHERE visitor_key = ? AND visited_at >= ?`,
    [visitorKey, cutoff]
  );

  if ((recent[0]?.cnt ?? 0) > 0) return;

  await queryD1(`INSERT INTO site_visits (visitor_key, visited_at) VALUES (?, ?)`, [
    visitorKey,
    now,
  ]);
};

const jsonWithNoStore = (
  body: object,
  init?: ResponseInit,
  visitor?: ReturnType<typeof getVisitor>
) => {
  const headers = new Headers(init?.headers);
  headers.set('Cache-Control', NO_STORE_HEADERS['Cache-Control']);
  const response = NextResponse.json(body, {
    ...init,
    headers,
  });

  if (visitor?.shouldSetCookie) {
    response.cookies.set(VISITOR_COOKIE, visitor.visitorId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
};

export async function GET(request: NextRequest) {
  try {
    if (request.nextUrl.searchParams.get('scope') === 'all') {
      const views = await getSiteVisits();
      return jsonWithNoStore(views);
    }

    const pathname = request.nextUrl.searchParams.get('pathname') ?? '/';
    const views = await getViews(pathname);
    return jsonWithNoStore(views);
  } catch {
    return jsonWithNoStore({ error: 'Failed to load views' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const pathname: string = body.pathname ?? '/';

    const ip = getClientIp(request);
    const visitor = getVisitor(request);

    if (ip === '127.0.0.1' || ip === '::1') {
      return jsonWithNoStore({ ok: true, counted: false }, undefined, visitor);
    }

    const cutoff = Math.floor((Date.now() - INTERVAL_MS) / 1000);
    const now = Math.floor(Date.now() / 1000);
    await recordSiteVisit(visitor.key, cutoff, now);

    const recent = await queryD1<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM page_views WHERE ip = ? AND pathname = ? AND visited_at >= ?`,
      [visitor.key, pathname, cutoff]
    );

    if ((recent[0]?.cnt ?? 0) > 0) {
      return jsonWithNoStore({ ok: true, counted: false }, undefined, visitor);
    }

    await queryD1(`INSERT INTO page_views (ip, pathname, visited_at) VALUES (?, ?, ?)`, [
      visitor.key,
      pathname,
      now,
    ]);

    return jsonWithNoStore({ ok: true, counted: true }, undefined, visitor);
  } catch {
    return jsonWithNoStore({ error: 'Failed to record view' }, { status: 500 });
  }
}
