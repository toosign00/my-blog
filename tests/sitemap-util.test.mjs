import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLatestDate,
  getLatestPostDate,
  getLatestProjectDate,
  toIsoDate,
} from '../src/utils/sitemap-util.ts';

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
    {
      category: 'Dev',
      createdAt: '2026-01-01T00:00:00.000Z',
      modifiedAt: '2026-01-03T00:00:00.000Z',
    },
    {
      category: 'Life',
      createdAt: '2026-01-02T00:00:00.000Z',
      modifiedAt: '2026-07-18T00:00:00.000Z',
    },
  ];

  assert.equal(
    getLatestPostDate(posts, ({ category }) => category === 'Dev'),
    '2026-01-03T00:00:00.000Z'
  );
});

test('combines an explicit page date with displayed content dates', () => {
  const dates = [{ date: '2026-06-26T16:49:52.000Z' }, { date: '2026-07-18T00:00:00.000Z' }];

  assert.equal(
    getLatestDate(dates, ({ date }) => date),
    '2026-07-18T00:00:00.000Z'
  );
});

test('uses project modifiedAt instead of projectDue', () => {
  const projects = [
    {
      modifiedAt: '2026-07-18T00:00:00.000Z',
      projectDue: '2027-01-01T00:00:00.000Z',
    },
  ];

  assert.equal(getLatestProjectDate(projects), '2026-07-18T00:00:00.000Z');
});

test('serializes sitemap dates as ISO 8601 timestamps', () => {
  assert.equal(toIsoDate('2026-07-18'), '2026-07-18T00:00:00.000Z');
});
