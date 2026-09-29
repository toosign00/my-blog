import { decodeSlugSegment, slugify } from './text-util';

it.each([
  ['Hello World/React', 'hello-world-react'],
  ['한글 태그', '한글-태그'],
  ['A\tB\nC', 'a-b-c'],
  ['', ''],
])('creates a slug for %s', (input, expected) => {
  expect(slugify(input)).toBe(expected);
});

it.each([
  ['%ED%95%9C%EA%B8%80', '한글'],
  ['hello%20world', 'hello world'],
  ['plain-slug', 'plain-slug'],
  ['%E0%A4%A', '%E0%A4%A'],
  ['100%', '100%'],
  ['', ''],
])('decodes %s with a fallback for malformed encoding', (input, expected) => {
  expect(decodeSlugSegment(input)).toBe(expected);
});
