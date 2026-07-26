import {
  MAX_BATCH_VIEW_PATHNAMES,
  mapBatchViews,
  normalizeBatchViewPathnames,
} from './views-batch-util';

describe('normalizeBatchViewPathnames', () => {
  const postSlugs = ['first-post', 'second-post'];

  it('removes duplicate pathnames while preserving their first-seen order', () => {
    expect(
      normalizeBatchViewPathnames(
        ['/posts/second-post', '/', '/posts/second-post', '/posts/first-post'],
        postSlugs
      )
    ).toEqual(['/posts/second-post', '/', '/posts/first-post']);
  });

  it('rejects an empty batch', () => {
    expect(normalizeBatchViewPathnames([], postSlugs)).toBeNull();
  });

  it('rejects a batch with more than the maximum number of unique pathnames', () => {
    const pathnames = Array.from(
      { length: MAX_BATCH_VIEW_PATHNAMES + 1 },
      (_, index) => `/posts/post-${index}`
    );
    const slugs = Array.from(
      { length: MAX_BATCH_VIEW_PATHNAMES + 1 },
      (_, index) => `post-${index}`
    );

    expect(normalizeBatchViewPathnames(pathnames, slugs)).toBeNull();
  });

  it('accepts duplicate input when the unique pathname count is within the limit', () => {
    const pathnames = Array.from(
      { length: MAX_BATCH_VIEW_PATHNAMES + 1 },
      () => '/posts/first-post'
    );

    expect(normalizeBatchViewPathnames(pathnames, postSlugs)).toEqual(['/posts/first-post']);
  });

  it('rejects the entire batch when one pathname is not countable', () => {
    expect(
      normalizeBatchViewPathnames(['/', '/posts/unknown', '/posts/first-post'], postSlugs)
    ).toBeNull();
  });
});

describe('mapBatchViews', () => {
  it('maps totals in request order and defaults missing rows to zero', () => {
    expect(
      mapBatchViews(
        ['/posts/second-post', '/', '/posts/first-post'],
        [
          { pathname: '/', total: 12 },
          { pathname: '/posts/second-post', total: 7 },
        ]
      )
    ).toEqual({
      '/posts/second-post': { today: 0, total: 7 },
      '/': { today: 0, total: 12 },
      '/posts/first-post': { today: 0, total: 0 },
    });
  });
});
