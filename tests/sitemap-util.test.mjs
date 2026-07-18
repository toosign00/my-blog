import assert from 'node:assert/strict';
import test from 'node:test';
import { getLatestDate, toIsoDate } from '../src/utils/sitemap-util.ts';

test('returns the newest selected date', () => {
  const items = [
    { createdAt: '2026-01-01T00:00:00.000Z', modifiedAt: '2026-01-03T00:00:00.000Z' },
    { createdAt: '2026-01-02T00:00:00.000Z', modifiedAt: '2026-01-04T00:00:00.000Z' },
  ];

  assert.equal(
    getLatestDate(items, ({ modifiedAt, createdAt }) => modifiedAt ?? createdAt),
    '2026-01-04T00:00:00.000Z'
  );
});

test('returns undefined for an empty collection', () => {
  assert.equal(
    getLatestDate([], () => undefined),
    undefined
  );
});

test('can scope a derived page to only related content', () => {
  const posts = [
    { category: 'Dev', modifiedAt: '2026-01-03T00:00:00.000Z' },
    { category: 'Life', modifiedAt: '2026-07-18T00:00:00.000Z' },
  ];

  const devPosts = posts.filter(({ category }) => category === 'Dev');
  assert.equal(
    getLatestDate(devPosts, ({ modifiedAt }) => modifiedAt),
    '2026-01-03T00:00:00.000Z'
  );
});

test('serializes sitemap dates as ISO 8601 timestamps', () => {
  assert.equal(toIsoDate('2026-07-18'), '2026-07-18T00:00:00.000Z');
});
