import { queryD1 } from './d1-util';
import { getBatchViews, getSiteVisits, getTodayVisitDate, getViews } from './views-util';

jest.mock('./d1-util', () => ({
  queryD1: jest.fn(),
}));

const queryD1Mock = queryD1 as jest.MockedFunction<typeof queryD1>;

describe('getTodayVisitDate', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the current date in the Asia/Seoul timezone', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-04T16:00:00.000Z'));

    expect(getTodayVisitDate()).toBe('2026-09-05');
  });
});

describe('getViews', () => {
  it('returns the stored total for the requested pathname', async () => {
    queryD1Mock.mockResolvedValue([{ today: 0, total: 42 }]);

    await expect(getViews('/posts/hello')).resolves.toEqual({ today: 0, total: 42 });
    expect(queryD1Mock.mock.calls[0][1]).toEqual(['/posts/hello']);
  });

  it('defaults to the home pathname', async () => {
    queryD1Mock.mockResolvedValue([{ today: 0, total: 1 }]);

    await getViews();

    expect(queryD1Mock.mock.calls[0][1]).toEqual(['/']);
  });

  it('returns zero counts when the pathname has no row', async () => {
    queryD1Mock.mockResolvedValue([]);

    await expect(getViews('/posts/unseen')).resolves.toEqual({ today: 0, total: 0 });
  });
});

describe('getBatchViews', () => {
  it('maps every requested pathname to its total', async () => {
    queryD1Mock.mockResolvedValue([{ pathname: '/posts/hello', total: 5 }]);

    await expect(getBatchViews(['/posts/hello', '/posts/unseen'])).resolves.toEqual({
      '/posts/hello': { today: 0, total: 5 },
      '/posts/unseen': { today: 0, total: 0 },
    });
  });

  it('binds one placeholder per requested pathname', async () => {
    queryD1Mock.mockResolvedValue([]);

    await getBatchViews(['/', '/posts/hello']);

    const [sql, params] = queryD1Mock.mock.calls[0];
    expect(sql).toContain('IN (?, ?)');
    expect(params).toEqual(['/', '/posts/hello']);
  });
});

describe('getSiteVisits', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns the aggregated today and total visit counts', async () => {
    queryD1Mock.mockResolvedValue([{ today: 3, total: 120 }]);

    await expect(getSiteVisits()).resolves.toEqual({ today: 3, total: 120 });
  });

  it('counts today against the Asia/Seoul date', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-04T16:00:00.000Z'));
    queryD1Mock.mockResolvedValue([{ today: 3, total: 120 }]);

    await getSiteVisits();

    expect(queryD1Mock.mock.calls[0][1]).toEqual(['2026-09-05']);
  });

  it('returns zero counts when the table is empty', async () => {
    queryD1Mock.mockResolvedValue([]);

    await expect(getSiteVisits()).resolves.toEqual({ today: 0, total: 0 });
  });
});
