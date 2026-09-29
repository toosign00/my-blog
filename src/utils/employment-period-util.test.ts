import { getEmploymentPeriodLabels } from './employment-period-util';

it.each([
  ['2026.01', '2026.01', '1개월'],
  ['2026.01', '2026.11', '11개월'],
  ['2026.01', '2026.12', '1년'],
  ['2025.12', '2026.12', '1년 1개월'],
  ['2026.03', '2026.01', '0개월'],
])('formats %s through %s as %s', (start, end, duration) => {
  expect(getEmploymentPeriodLabels(start, end)).toEqual({
    period: `${start} - ${end}`,
    duration,
  });
});

it.each([
  ['invalid', '2026.01'],
  ['2026.01', 'invalid'],
  ['2026.00', '2026.01'],
  ['2026.01', '2026.13'],
  ['2026.1', '2026.02'],
])('preserves the period without a duration for %s through %s', (start, end) => {
  expect(getEmploymentPeriodLabels(start, end)).toEqual({
    period: `${start} - ${end}`,
    duration: null,
  });
});

it('calculates ongoing employment using the supplied reference month', () => {
  expect(getEmploymentPeriodLabels('2025.09', null, new Date(2026, 8, 25))).toEqual({
    period: '2025.09 - 현재',
    duration: '1년 1개월',
  });
});

it('defaults ongoing employment to the current month', () => {
  jest.useFakeTimers();
  try {
    jest.setSystemTime(new Date(2026, 8, 25));
    expect(getEmploymentPeriodLabels('2026.09', null)).toEqual({
      period: '2026.09 - 현재',
      duration: '1개월',
    });
  } finally {
    jest.useRealTimers();
  }
});
