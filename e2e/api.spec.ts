import { expect, test } from './fixtures';

// A public HTTP literal avoids DNS and TLS SNI; next.onFetch intercepts all requests.
const previewOrigin = 'http://93.184.216.34';

test('extracts preview metadata after a safe relative redirect', async ({ page, next }) => {
  next.onFetch((request) => {
    if (!request.url.startsWith(previewOrigin)) return undefined;
    if (new URL(request.url).pathname === '/start') {
      return new Response(null, { status: 302, headers: { Location: '/articles/final' } });
    }
    return new Response(
      `<title>Fallback</title><meta property="og:title" content="Preview title">
       <meta name="description" content="Preview description">
       <meta property="og:image" content="cover.png"><link rel="icon" href="/icon.png">`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  });
  const response = await page.goto(
    `/api/link-preview?url=${encodeURIComponent(`${previewOrigin}/start`)}`
  );
  expect(response?.status()).toBe(200);
  expect(await response?.json()).toEqual({
    title: 'Preview title',
    description: 'Preview description',
    image: `${previewOrigin}/articles/cover.png`,
    favicon: `${previewOrigin}/icon.png`,
  });
});

test('rejects unsafe redirects, non-HTML responses, oversized HTML and upstream errors', async ({
  page,
  next,
}) => {
  next.onFetch((request) => {
    if (!request.url.startsWith(previewOrigin)) return undefined;
    switch (new URL(request.url).pathname) {
      case '/private':
        return new Response(null, {
          status: 302,
          headers: { Location: 'http://127.0.0.1/private' },
        });
      case '/loop':
        return new Response(null, { status: 302, headers: { Location: '/loop' } });
      case '/json':
        return Response.json({ title: 'Not HTML' });
      case '/large':
        return new Response('x'.repeat(512_001), { headers: { 'Content-Type': 'text/html' } });
      case '/large-tag':
        return new Response(`<meta content="${'x'.repeat(8192)}">`, {
          headers: { 'Content-Type': 'text/html' },
        });
      default:
        return new Response(null, { status: 503 });
    }
  });
  for (const [path, status, error] of [
    ['/private', 400, 'Blocked private or internal URL'],
    ['/loop', 400, 'Too many redirects'],
    ['/json', 415, 'Target URL did not return HTML'],
    ['/large', 413, 'Target HTML is too large'],
    ['/large-tag', 413, 'Target HTML metadata tag is too large'],
    ['/unavailable', 502, 'Failed to fetch target URL'],
  ] as const) {
    const response = await page.goto(
      `/api/link-preview?url=${encodeURIComponent(previewOrigin + path)}`
    );
    expect(response?.status()).toBe(status);
    expect(await response?.json()).toEqual({ error });
  }
});

test('handles repeated unmatched metadata openers within the body limit', async ({
  page,
  next,
}) => {
  next.onFetch((request) => {
    if (!request.url.startsWith(previewOrigin)) return undefined;
    const tag = new URL(request.url).pathname.slice(1);
    return new Response(`${`<${tag} `.repeat(68000)}<title>Valid</title>`, {
      headers: { 'Content-Type': 'text/html' },
    });
  });
  for (const tag of ['meta', 'link', 'title']) {
    const response = await page.goto(
      `/api/link-preview?url=${encodeURIComponent(`${previewOrigin}/${tag}`)}`
    );
    expect(response?.status()).toBe(200);
    expect(await response?.json()).toEqual({
      title: 'Valid',
      favicon: `${previewOrigin}/favicon.ico`,
    });
  }
});

test('serves the configured IndexNow verification key', async ({ request }) => {
  const response = await request.get('/indexnow-key.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/plain');
  expect(await response.text()).toBe('e2e-indexnow-key');
});

test('returns single and deduplicated batch views with missing counts set to zero', async ({
  page,
  next,
}) => {
  next.onFetch(async (request) => {
    if (!request.url.includes('/d1/')) return undefined;
    const { sql } = await request.json();
    return Response.json({
      success: true,
      result: [
        {
          success: true,
          results: sql.includes(' IN ')
            ? [{ pathname: '/posts/filmlog-01', total: 7 }]
            : [{ total: 7 }],
        },
      ],
    });
  });
  const single = await page.goto('/api/views?pathname=/posts/filmlog-01');
  expect(single?.status()).toBe(200);
  expect(await single?.json()).toEqual({ today: 0, total: 7 });
  const batch = await page.goto(
    '/api/views?pathnames=/posts/filmlog-01,/posts/filmlog-02,/posts/filmlog-01'
  );
  expect(batch?.status()).toBe(200);
  expect(await batch?.json()).toEqual({
    '/posts/filmlog-01': { today: 0, total: 7 },
    '/posts/filmlog-02': { today: 0, total: 0 },
  });
  const invalid = await page.goto('/api/views?pathnames=/posts/missing-post');
  expect(invalid?.status()).toBe(400);
  expect(await invalid?.json()).toEqual({ error: 'Invalid pathnames' });
});

test('returns a no-store error when recording a view fails upstream', async ({ page, next }) => {
  next.onFetch((request) =>
    request.url.includes('/d1/') ? new Response(null, { status: 503 }) : undefined
  );
  await page.goto('/indexnow-key.txt');
  const result = await page.evaluate(async () => {
    const response = await fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-real-ip': '198.51.100.10' },
      body: JSON.stringify({ pathname: '/' }),
    });
    return {
      status: response.status,
      cache: response.headers.get('cache-control'),
      body: await response.json(),
    };
  });
  expect(result).toEqual({
    status: 500,
    cache: 'no-store, max-age=0',
    body: { error: 'Failed to record view' },
  });
});

test('rejects invalid preview URLs before contacting an upstream', async ({ request }) => {
  for (const [url, message] of [
    ['', 'Missing url query parameter'],
    ['invalid', 'Invalid URL'],
    ['file:///etc/passwd', 'Unsupported protocol'],
    ['http://127.0.0.1/private', 'Blocked private or internal URL'],
  ]) {
    const response = await request.get('/api/link-preview', { params: { url } });
    expect(response.status()).toBe(400);
    expect(await response.json()).toEqual({ error: message });
  }
});

test('returns view totals through the real route and isolates upstream failures', async ({
  page,
  next,
}) => {
  next.onFetch((request) =>
    request.url.includes('/d1/')
      ? Response.json({
          success: true,
          result: [{ success: true, results: [{ today: 2, total: 9 }] }],
        })
      : undefined
  );
  const response = await page.goto('/api/views?scope=all');
  expect(response?.status()).toBe(200);
  expect(await response?.json()).toEqual({ today: 2, total: 9 });
  expect(response?.headers()['cache-control']).toBe('no-cache');
  next.onFetch((request) =>
    request.url.includes('/d1/') ? new Response(null, { status: 503 }) : undefined
  );
  const failed = await page.goto('/api/views?scope=all');
  expect(failed?.status()).toBe(500);
  expect(await failed?.json()).toEqual({ error: 'Failed to load views' });
  expect(failed?.headers()['cache-control']).toContain('no-store');
});

test('rejects invalid view paths and sets a visitor cookie for a local visit', async ({
  page,
  next: _next,
}) => {
  await page.goto('/indexnow-key.txt');
  // Requesting next registers the fixture D1 mock; a local visit still reads counts from D1.
  const post = (pathname: string) =>
    page.evaluate(async (pathname) => {
      const response = await fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathname }),
      });
      return {
        status: response.status,
        cache: response.headers.get('cache-control'),
        body: await response.json(),
      };
    }, pathname);
  expect((await post('/invalid')).status).toBe(400);
  expect(await post('/')).toEqual({
    status: 200,
    cache: 'no-store, max-age=0',
    body: {
      ok: true,
      counted: false,
      site: { today: 0, total: 0 },
      page: { today: 0, total: 0 },
    },
  });
  const cookies = await page.context().cookies();
  expect(cookies.find(({ name }) => name === 'views_visitor_id')).toMatchObject({
    httpOnly: true,
  });
});

test('records a new visitor and suppresses a repeated visit', async ({ page, next }) => {
  let seen = false;
  let d1Requests = 0;
  next.onFetch(async (request) => {
    if (!request.url.includes('/d1/')) return undefined;
    d1Requests++;
    const { batch } = (await request.json()) as { batch: { sql: string }[] };
    // The page view insert returns a row only when it actually counted the visit.
    const rowsFor = (sql: string) => {
      if (sql.includes('INSERT INTO page_view_counts')) {
        const rows = seen ? [] : [{ counted: 1 }];
        seen = true;
        return rows;
      }
      if (sql.includes('FROM daily_site_visit_counts')) return [{ today: 1, total: 10 }];
      if (sql.includes('FROM page_view_counts')) return [{ today: 0, total: 3 }];
      return [];
    };
    return Response.json({
      success: true,
      result: batch.map(({ sql }) => ({ success: true, results: rowsFor(sql) })),
    });
  });
  await page.goto('/indexnow-key.txt');
  const record = () =>
    page.evaluate(async () => {
      const response = await fetch('/api/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-real-ip': '198.51.100.10' },
        body: JSON.stringify({ pathname: '/' }),
      });
      return { status: response.status, data: await response.json() };
    });
  const counts = { site: { today: 1, total: 10 }, page: { today: 0, total: 3 } };
  expect(await record()).toEqual({ status: 200, data: { ok: true, counted: true, ...counts } });
  expect(await record()).toEqual({ status: 200, data: { ok: true, counted: false, ...counts } });
  expect(d1Requests).toBe(2);
});
