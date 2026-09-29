import { getLatestDate, getLatestPostDate, getLatestProjectDate, toIsoDate } from './sitemap-util';

it('returns no date for empty input or missing dates', () => {
  expect(getLatestDate([], (item: string) => item)).toBeUndefined();
  expect(getLatestDate([undefined, ''], (item) => item)).toBeUndefined();
});

it('chooses the latest instant regardless of ordering and timezone offsets', () => {
  expect(
    getLatestDate(
      [
        undefined,
        '2026-09-25T12:00:00+09:00',
        '2026-09-25T04:00:00Z',
        '2026-09-24T23:00:00Z',
        '2026-09-25T04:00:00Z',
      ],
      (item) => item
    )
  ).toBe('2026-09-25T04:00:00Z');
});

const posts = [
  { category: 'React', createdAt: '2026-01-01', modifiedAt: '2026-09-01' },
  { category: 'Testing', createdAt: '2026-08-01' },
  { category: 'React', createdAt: '2026-02-01' },
];

it.each([
  ['2026-13-01', '2026-05-01'],
  ['2026-05-01', '2026-13-01'],
])('skips unparseable dates in %s and %s', (first, second) => {
  expect(getLatestDate([first, second], (value) => value)).toBe('2026-05-01');
});

it('returns no date when every date is unparseable', () => {
  expect(getLatestDate(['2026-13-01', '26-06-2026'], (value) => value)).toBeUndefined();
});

it('uses modified dates when present and creation dates otherwise', () => {
  expect(getLatestPostDate(posts)).toBe('2026-09-01');
  expect(getLatestPostDate([posts[1]])).toBe('2026-08-01');
});

it('considers only matching posts and handles no matches', () => {
  expect(getLatestPostDate(posts, (post) => post.category === 'Testing')).toBe('2026-08-01');
  expect(getLatestPostDate(posts, (post) => post.category === 'Unknown')).toBeUndefined();
  expect(getLatestPostDate([])).toBeUndefined();
});

it('selects the latest project modification date', () => {
  expect(
    getLatestProjectDate([
      { modifiedAt: '2026-01-01' },
      { modifiedAt: '2026-09-01' },
      { modifiedAt: '2026-06-01' },
    ])
  ).toBe('2026-09-01');
  expect(getLatestProjectDate([])).toBeUndefined();
});

it.each(['2026-09-25T12:00:00+09:00', new Date('2026-09-25T12:00:00+09:00')])(
  'normalizes %s to UTC ISO format',
  (value) => {
    expect(toIsoDate(value)).toBe('2026-09-25T03:00:00.000Z');
  }
);
