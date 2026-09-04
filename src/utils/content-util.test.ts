import {
  isNonEmptyString,
  isRemoteImage,
  isStringArray,
  isValidDateString,
  isValidUrl,
  resolveCoverAsset,
} from './content-util';

describe('isNonEmptyString', () => {
  it.each([
    ['text', true],
    ['', false],
    ['   ', false],
  ])('returns %p for %p', (value, expected) => {
    expect(isNonEmptyString(value)).toBe(expected);
  });

  it.each([[undefined], [null], [0], [['text']]])('rejects the non-string value %p', (value) => {
    expect(isNonEmptyString(value)).toBe(false);
  });
});

describe('isStringArray', () => {
  it('accepts an array of non-empty strings', () => {
    expect(isStringArray(['QA', '자격증'])).toBe(true);
  });

  it('accepts an empty array', () => {
    expect(isStringArray([])).toBe(true);
  });

  it('rejects an array containing a blank string', () => {
    expect(isStringArray(['QA', '  '])).toBe(false);
  });

  it('rejects a value that is not an array', () => {
    expect(isStringArray('QA')).toBe(false);
  });
});

describe('isValidDateString', () => {
  it.each([
    ['2026-01-01', true],
    ['2026-01-01T00:00:00.000Z', true],
    ['not-a-date', false],
    ['', false],
  ])('returns %p for %p', (value, expected) => {
    expect(isValidDateString(value)).toBe(expected);
  });
});

describe('isValidUrl', () => {
  it.each([
    ['https://example.com', true],
    ['http://example.com/path?a=1', true],
    ['/covers/posts/hello/cover.webp', false],
    ['example.com', false],
  ])('returns %p for %p', (value, expected) => {
    expect(isValidUrl(value)).toBe(expected);
  });
});

describe('isRemoteImage', () => {
  it.each([
    ['https://files.toosign.me/cover.webp', true],
    ['http://files.toosign.me/cover.webp', false],
    ['./cover.webp', false],
  ])('returns %p for %p', (value, expected) => {
    expect(isRemoteImage(value)).toBe(expected);
  });
});

describe('resolveCoverAsset', () => {
  it('returns a remote asset URL unchanged', () => {
    expect(resolveCoverAsset('posts', 'hello', 'https://files.toosign.me/cover.webp')).toBe(
      'https://files.toosign.me/cover.webp'
    );
  });

  it('builds a public cover path from a relative asset name', () => {
    expect(resolveCoverAsset('posts', 'hello', './cover.webp')).toBe(
      '/covers/posts/hello/cover.webp'
    );
  });

  it('builds a public cover path from a bare asset name', () => {
    expect(resolveCoverAsset('projects', 'my-blog', 'hero.webp')).toBe(
      '/covers/projects/my-blog/hero.webp'
    );
  });
});
