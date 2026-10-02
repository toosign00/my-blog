import { type NextRequest, NextResponse } from 'next/server';
import { isAllowedViewPathname } from '@/utils/api-validation-util';
import { normalizeBatchViewPathnames } from '@/utils/views-batch-util';
import { getBatchViews, getSiteVisits, getViews, recordVisit } from '@/utils/views-util';

const INTERVAL_MS = 30 * 60 * 1000;
const NO_CACHE_HEADERS = { 'Cache-Control': 'no-cache' };
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
      maxAge: 60 * 60 * 24 * 180,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return response;
};

const jsonWithNoCache = (body: object, init?: ResponseInit) =>
  NextResponse.json(body, {
    ...init,
    headers: NO_CACHE_HEADERS,
  });

export async function GET(request: NextRequest) {
  try {
    if (request.nextUrl.searchParams.get('scope') === 'all') {
      const views = await getSiteVisits();
      return jsonWithNoCache(views);
    }

    const batchParam = request.nextUrl.searchParams.get('pathnames');
    if (batchParam !== null) {
      const { getPostSlugs } = await import('@/utils/post-util');
      const postSlugs = await getPostSlugs();
      const pathnames = normalizeBatchViewPathnames(batchParam.split(','), postSlugs);

      if (!pathnames) {
        return jsonWithNoStore({ error: 'Invalid pathnames' }, { status: 400 });
      }

      const views = await getBatchViews(pathnames);
      return jsonWithNoCache(views);
    }

    const pathname = request.nextUrl.searchParams.get('pathname') ?? '/';
    const views = await getViews(pathname);
    return jsonWithNoCache(views);
  } catch {
    return jsonWithNoStore({ error: 'Failed to load views' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const pathname: string = body.pathname ?? '/';
    const { getPostSlugs } = await import('@/utils/post-util');
    const postSlugs = await getPostSlugs();

    if (!isAllowedViewPathname(pathname, postSlugs)) {
      return jsonWithNoStore({ error: 'Invalid pathname' }, { status: 400 });
    }

    const ip = getClientIp(request);
    const visitor = getVisitor(request);

    const isLocal = ip === '127.0.0.1' || ip === '::1';
    const visit = await recordVisit(visitor.key, pathname, INTERVAL_MS, !isLocal);

    return jsonWithNoStore({ ok: true, ...visit }, undefined, visitor);
  } catch {
    return jsonWithNoStore({ error: 'Failed to record view' }, { status: 500 });
  }
}
