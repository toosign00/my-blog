import { getLatestDate, getLatestPostDate, getLatestProjectDate, toIsoDate } from './sitemap-util';

describe('getLatestDate', () => {
  it('returns the most recent date among the items', () => {
    const items = [{ date: '2026-01-01' }, { date: '2026-03-01' }, { date: '2026-02-01' }];

    expect(getLatestDate(items, (item) => item.date)).toBe('2026-03-01');
  });

  it('skips items without a date', () => {
    const items = [{ date: undefined }, { date: '2026-01-01' }, { date: undefined }];

    expect(getLatestDate(items, (item) => item.date)).toBe('2026-01-01');
  });

  it('skips an unparseable date that comes first', () => {
    const items = [{ date: '2026-13-01' }, { date: '2026-05-01' }];

    expect(getLatestDate(items, (item) => item.date)).toBe('2026-05-01');
  });

  it('skips an unparseable date that comes last', () => {
    const items = [{ date: '2026-05-01' }, { date: '2026-13-01' }];

    expect(getLatestDate(items, (item) => item.date)).toBe('2026-05-01');
  });

  it('returns undefined when every date is unparseable', () => {
    const items = [{ date: '2026-13-01' }, { date: '26-06-2026' }];

    expect(getLatestDate(items, (item) => item.date)).toBeUndefined();
  });

  it('returns undefined when no item has a date', () => {
    expect(getLatestDate([{ date: undefined }], (item) => item.date)).toBeUndefined();
  });

  it('returns undefined for an empty list', () => {
    expect(getLatestDate([], () => undefined)).toBeUndefined();
  });
});

describe('getLatestPostDate', () => {
  const posts = [
    { createdAt: '2026-01-01', modifiedAt: '2026-05-01', category: 'Dev' },
    { createdAt: '2026-03-01', category: 'Essay' },
  ];

  it('prefers the modified date over the created date', () => {
    expect(getLatestPostDate(posts)).toBe('2026-05-01');
  });

  it('falls back to the created date when a post was never modified', () => {
    expect(getLatestPostDate(posts, (post) => post.category === 'Essay')).toBe('2026-03-01');
  });

  it('returns undefined when no post matches the filter', () => {
    expect(getLatestPostDate(posts, (post) => post.category === 'Film')).toBeUndefined();
  });
});

describe('getLatestProjectDate', () => {
  it('returns the most recent modified date', () => {
    expect(getLatestProjectDate([{ modifiedAt: '2026-02-01' }, { modifiedAt: '2026-04-01' }])).toBe(
      '2026-04-01'
    );
  });

  it('returns undefined for an empty list', () => {
    expect(getLatestProjectDate([])).toBeUndefined();
  });
});

describe('toIsoDate', () => {
  it('converts a date string to an ISO timestamp', () => {
    expect(toIsoDate('2026-01-01')).toBe('2026-01-01T00:00:00.000Z');
  });

  it('converts a Date instance to an ISO timestamp', () => {
    expect(toIsoDate(new Date('2026-01-01T09:30:00.000Z'))).toBe('2026-01-01T09:30:00.000Z');
  });
});
