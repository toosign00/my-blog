import { formatRelativeTime } from './date-util';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-07-25T12:00:00'));
});

afterEach(() => {
  jest.useRealTimers();
});

it.each([
  ['2026-07-25T11:59:01', 'just now'],
  ['2026-07-25T11:59:00', '1m ago'],
  ['2026-07-25T11:00:00', '1h ago'],
  ['2026-07-24T13:00:00', '23h ago'],
  ['2026-07-24T12:00:00', '2026. 7. 24.'],
])('formats %s as %s', (date, expected) => {
  expect(formatRelativeTime(date)).toBe(expected);
});
