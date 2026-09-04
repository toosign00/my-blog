import { getEmploymentPeriodLabels } from './employment-period-util';

const REFERENCE = new Date('2026-09-15T00:00:00.000Z');

describe('getEmploymentPeriodLabels', () => {
  it('shows the end month in the period when the employment has ended', () => {
    expect(getEmploymentPeriodLabels('2024.01', '2024.06').period).toBe('2024.01 - 2024.06');
  });

  it('shows 현재 in the period when the employment is ongoing', () => {
    expect(getEmploymentPeriodLabels('2024.01', null, REFERENCE).period).toBe('2024.01 - 현재');
  });

  it.each([
    ['2024.01', '2024.01', '1개월'],
    ['2024.01', '2024.11', '11개월'],
    ['2024.01', '2024.12', '1년'],
    ['2024.01', '2025.02', '1년 2개월'],
    ['2024.01', '2025.12', '2년'],
  ])('reports %s - %s as %s', (startMonth, endMonth, expected) => {
    expect(getEmploymentPeriodLabels(startMonth, endMonth).duration).toBe(expected);
  });

  it('measures an ongoing period up to the reference month inclusively', () => {
    expect(getEmploymentPeriodLabels('2026.07', null, REFERENCE).duration).toBe('3개월');
  });

  it('reports 0개월 when the end month is earlier than the start month', () => {
    expect(getEmploymentPeriodLabels('2024.06', '2024.01').duration).toBe('0개월');
  });

  it.each([
    ['2024.13', '2024.06'],
    ['2024.00', '2024.06'],
    ['2024-01', '2024.06'],
    ['2024.01', 'not-a-month'],
  ])('omits the duration when %s - %s is not a valid month range', (startMonth, endMonth) => {
    expect(getEmploymentPeriodLabels(startMonth, endMonth).duration).toBeNull();
  });

  it('still returns the period text when the duration cannot be calculated', () => {
    expect(getEmploymentPeriodLabels('2024.13', null, REFERENCE).period).toBe('2024.13 - 현재');
  });
});
