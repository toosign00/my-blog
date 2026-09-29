import {
  isNonEmptyString,
  isRemoteImage,
  isStringArray,
  isValidDateString,
  isValidUrl,
  resolveCoverAsset,
} from './content-util';

it.each([
  ['hello', true],
  [' 한글 ', true],
  ['', false],
  [' \n\t', false],
  [null, false],
  [undefined, false],
  [42, false],
  [{}, false],
])('validates nonempty string %j', (value, expected) => {
  expect(isNonEmptyString(value)).toBe(expected);
});

it.each([
  [[], true],
  [['React', '한글'], true],
  [[''], false],
  [[' '], false],
  [['React', 1], false],
  ['React', false],
  [null, false],
])('validates string array %j', (value, expected) => {
  expect(isStringArray(value)).toBe(expected);
});

it.each([
  ['2026-09-25', true],
  ['2026-09-25T12:00:00+09:00', true],
  ['', false],
  ['not-a-date', false],
  ['2026-13-01', false],
])('validates date string %s', (value, expected) => {
  expect(isValidDateString(value)).toBe(expected);
});

it.each([
  ['https://example.com/post?q=1', true],
  ['http://example.com', true],
  ['/relative', false],
  ['example.com', false],
  ['', false],
])('validates absolute URL %s', (value, expected) => {
  expect(isValidUrl(value)).toBe(expected);
});

it.each([
  ['https://example.com/cover.png', true],
  ['http://example.com/cover.png', false],
  ['./cover.png', false],
])('recognizes HTTPS remote image %s', (value, expected) => {
  expect(isRemoteImage(value)).toBe(expected);
});

it('preserves a remote cover URL including its query', () => {
  expect(resolveCoverAsset('posts', 'example', 'https://example.com/cover.png?v=1')).toBe(
    'https://example.com/cover.png?v=1'
  );
});

it.each(['posts', 'projects'] as const)(
  'resolves local %s covers with or without a dot prefix',
  (type) => {
    expect(resolveCoverAsset(type, 'example', './cover.png')).toBe(
      `/covers/${type}/example/cover.png`
    );
    expect(resolveCoverAsset(type, 'example', 'cover.png')).toBe(
      `/covers/${type}/example/cover.png`
    );
  }
);
