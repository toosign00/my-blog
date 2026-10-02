/** @jest-environment node */
import {
  getBatchViews,
  getSiteVisits,
  getTodayVisitDate,
  getViews,
  recordVisit,
} from './views-util';

beforeEach(() => {
  jest.replaceProperty(process, 'env', {
    ...process.env,
    CLOUDFLARE_ACCOUNT_ID: 'test',
    CLOUDFLARE_D1_DATABASE_ID: 'test',
    CLOUDFLARE_API_TOKEN: 'test',
  });
});

afterEach(() => jest.useRealTimers());

const respond = (results: object[]) =>
  jest
    .spyOn(global, 'fetch')
    .mockResolvedValue(Response.json({ success: true, result: [{ success: true, results }] }));

it.each([
  ['2026-09-25T14:59:59Z', '2026-09-25'],
  ['2026-09-25T15:00:00Z', '2026-09-26'],
])('uses the Seoul date at %s', (instant, expected) => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(instant));
  expect(getTodayVisitDate()).toBe(expected);
});

it('returns page totals and binds the requested pathname', async () => {
  const fetch = respond([{ today: 0, total: 25 }]);
  await expect(getViews('/posts/test')).resolves.toEqual({ today: 0, total: 25 });
  expect(JSON.parse(fetch.mock.calls[0][1]?.body as string).params).toEqual(['/posts/test']);
});

it('defaults to the home page and zero totals for a missing record', async () => {
  const fetch = respond([]);
  await expect(getViews()).resolves.toEqual({ today: 0, total: 0 });
  expect(JSON.parse(fetch.mock.calls[0][1]?.body as string).params).toEqual(['/']);
});

it('maps batch results by pathname and fills missing pages with zero', async () => {
  respond([
    { pathname: '/b', total: 7 },
    { pathname: '/a', total: 4 },
  ]);
  await expect(getBatchViews(['/a', '/b', '/missing'])).resolves.toEqual({
    '/a': { today: 0, total: 4 },
    '/b': { today: 0, total: 7 },
    '/missing': { today: 0, total: 0 },
  });
});

it('returns site totals for the current Seoul date', async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-09-25T15:00:00Z'));
  const fetch = respond([{ today: 3, total: 100 }]);
  await expect(getSiteVisits()).resolves.toEqual({ today: 3, total: 100 });
  expect(JSON.parse(fetch.mock.calls[0][1]?.body as string).params).toEqual(['2026-09-26']);
});

it('returns zero site totals when no rows are returned', async () => {
  respond([]);
  await expect(getSiteVisits()).resolves.toEqual({ today: 0, total: 0 });
});

it('propagates database errors rather than reporting zero views', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('database unavailable'));
  await expect(getViews()).rejects.toThrow('database unavailable');
  await expect(getBatchViews(['/a'])).rejects.toThrow('database unavailable');
  await expect(getSiteVisits()).rejects.toThrow('database unavailable');
});

const respondBatch = (results: object[][]) =>
  jest.spyOn(global, 'fetch').mockResolvedValue(
    Response.json({
      success: true,
      result: results.map((rows) => ({ success: true, results: rows })),
    })
  );

const sentBatch = (fetch: jest.SpyInstance) =>
  JSON.parse(fetch.mock.calls[0][1]?.body as string).batch as {
    sql: string;
    params: (string | number)[];
  }[];

it('records a visit and reads the updated counts in one request', async () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-09-25T15:00:00Z'));
  const fetch = respondBatch([
    [],
    [{ counted: 1 }],
    [],
    [],
    [],
    [],
    [{ today: 3, total: 100 }],
    [{ today: 0, total: 8 }],
  ]);

  await expect(recordVisit('visitor:a', '/posts/test', 30 * 60 * 1000)).resolves.toEqual({
    counted: true,
    site: { today: 3, total: 100 },
    page: { today: 0, total: 8 },
  });

  const now = Math.floor(Date.parse('2026-09-25T15:00:00Z') / 1000);
  const cutoff = now - 30 * 60;
  const batch = sentBatch(fetch);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(batch.map(({ sql }) => sql.trim().split(/\s+/).slice(0, 3).join(' '))).toEqual([
    'INSERT INTO daily_site_visit_counts',
    'INSERT INTO page_view_counts',
    'INSERT INTO recent_site_visitors',
    'INSERT INTO recent_page_viewers',
    'DELETE FROM recent_site_visitors',
    'DELETE FROM recent_page_viewers',
    'SELECT COALESCE(SUM(CASE WHEN',
    'SELECT 0 as',
  ]);
  expect(batch.map(({ params }) => params)).toEqual([
    ['2026-09-26', 'visitor:a', cutoff],
    ['/posts/test', now, 'visitor:a', '/posts/test', cutoff],
    ['visitor:a', now, cutoff],
    ['visitor:a', '/posts/test', now, cutoff],
    [cutoff],
    [cutoff],
    ['2026-09-26'],
    ['/posts/test'],
  ]);
});

it('reports a repeated visit as not counted', async () => {
  respondBatch([[], [], [], [], [], [], [{ today: 3, total: 100 }], []]);
  await expect(recordVisit('visitor:a', '/', 1000)).resolves.toEqual({
    counted: false,
    site: { today: 3, total: 100 },
    page: { today: 0, total: 0 },
  });
});

it('only reads the counts when the visit must not be recorded', async () => {
  const fetch = respondBatch([[{ today: 3, total: 100 }], [{ today: 0, total: 8 }]]);
  await expect(recordVisit('visitor:a', '/', 1000, false)).resolves.toEqual({
    counted: false,
    site: { today: 3, total: 100 },
    page: { today: 0, total: 8 },
  });
  expect(sentBatch(fetch).every(({ sql }) => sql.trim().startsWith('SELECT'))).toBe(true);
});
