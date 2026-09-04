import { render, screen } from '@testing-library/react';
import { EmploymentPeriod } from './EmploymentPeriod';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-09-15T00:00:00.000Z'));
});

afterEach(() => {
  jest.useRealTimers();
});

describe('EmploymentPeriod', () => {
  it('shows the period and the duration of a finished employment', () => {
    render(
      <EmploymentPeriod
        endMonth='2025.02'
        initialLabels={{ period: '2024.01 - 2025.02', duration: '1년 2개월' }}
        startMonth='2024.01'
      />
    );

    expect(screen.getByText('2024.01 - 2025.02')).toBeInTheDocument();
    expect(screen.getByText('1년 2개월')).toBeInTheDocument();
  });

  it('recalculates an ongoing duration against the current date on the client', () => {
    render(
      <EmploymentPeriod
        endMonth={null}
        initialLabels={{ period: '2026.07 - 현재', duration: '1개월' }}
        startMonth='2026.07'
      />
    );

    expect(screen.getByText('3개월')).toBeInTheDocument();
    expect(screen.queryByText('1개월')).not.toBeInTheDocument();
  });

  it('shows only the period when the duration cannot be calculated', () => {
    render(
      <EmploymentPeriod
        endMonth={null}
        initialLabels={{ period: '2024.13 - 현재', duration: null }}
        startMonth='2024.13'
      />
    );

    expect(screen.getByText('2024.13 - 현재')).toBeInTheDocument();
    expect(screen.queryByText(/개월|년/)).not.toBeInTheDocument();
  });

  it('recalculates the labels when the months change', () => {
    const { rerender } = render(
      <EmploymentPeriod
        endMonth='2024.06'
        initialLabels={{ period: '2024.01 - 2024.06', duration: '6개월' }}
        startMonth='2024.01'
      />
    );

    rerender(
      <EmploymentPeriod
        endMonth='2025.06'
        initialLabels={{ period: '2024.01 - 2024.06', duration: '6개월' }}
        startMonth='2024.01'
      />
    );

    expect(screen.getByText('2024.01 - 2025.06')).toBeInTheDocument();
    expect(screen.getByText('1년 6개월')).toBeInTheDocument();
  });
});
