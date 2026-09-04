import { decodeSlugSegment, slugify } from './text-util';

describe('slugify', () => {
  it('lowercases the text', () => {
    expect(slugify('Next.js')).toBe('next.js');
  });

  it('replaces whitespace and slashes with a hyphen', () => {
    expect(slugify('QA Test')).toBe('qa-test');
    expect(slugify('QA/Test')).toBe('qa-test');
  });

  it('keeps Korean characters as they are', () => {
    expect(slugify('블로그')).toBe('블로그');
  });
});

describe('decodeSlugSegment', () => {
  it('decodes a percent encoded segment', () => {
    expect(decodeSlugSegment('%EB%B8%94%EB%A1%9C%EA%B7%B8')).toBe('블로그');
  });

  it('returns the original segment when it cannot be decoded', () => {
    expect(decodeSlugSegment('100%')).toBe('100%');
  });

  it('returns a plain segment unchanged', () => {
    expect(decodeSlugSegment('qa-test')).toBe('qa-test');
  });
});
