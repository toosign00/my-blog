import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { EmploymentPeriod } from './EmploymentPeriod';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 8, 25));
});

afterEach(() => {
  jest.useRealTimers();
});

it('renders the supplied initial labels before client effects run', () => {
  const html = renderToString(
    <EmploymentPeriod
      startMonth='2026.01'
      endMonth={null}
      initialLabels={{ period: '2026.01 - 현재', duration: '8개월' }}
    />
  );

  expect(html).toContain('2026.01 - 현재');
  expect(html).toContain('8개월');
  expect(html).not.toContain('9개월');
});

it('refreshes ongoing employment after mounting', () => {
  render(
    <EmploymentPeriod
      startMonth='2026.01'
      endMonth={null}
      initialLabels={{ period: '2026.01 - 현재', duration: '8개월' }}
    />
  );

  expect(screen.getByText('2026.01 - 현재')).toBeInTheDocument();
  expect(screen.getByText('9개월')).toBeInTheDocument();
  expect(screen.queryByText('8개월')).not.toBeInTheDocument();
});

it('recalculates when the end month and then the start month change', () => {
  const initialLabels = { period: '2026.01 - 현재', duration: '9개월' };
  const { rerender } = render(
    <EmploymentPeriod startMonth='2026.01' endMonth={null} initialLabels={initialLabels} />
  );

  rerender(
    <EmploymentPeriod startMonth='2026.01' endMonth='2026.12' initialLabels={initialLabels} />
  );
  expect(screen.getByText('2026.01 - 2026.12')).toBeInTheDocument();
  expect(screen.getByText('1년')).toBeInTheDocument();
  expect(screen.queryByText('9개월')).not.toBeInTheDocument();

  rerender(
    <EmploymentPeriod startMonth='2026.12' endMonth='2026.12' initialLabels={initialLabels} />
  );
  expect(screen.getByText('2026.12 - 2026.12')).toBeInTheDocument();
  expect(screen.getByText('1개월')).toBeInTheDocument();
  expect(screen.queryByText('1년')).not.toBeInTheDocument();
});

it('removes the duration when an input becomes invalid', () => {
  const initialLabels = { period: '2026.01 - 2026.12', duration: '1년' };
  const { rerender } = render(
    <EmploymentPeriod startMonth='2026.01' endMonth='2026.12' initialLabels={initialLabels} />
  );
  expect(screen.getByText('1년')).toBeInTheDocument();

  rerender(
    <EmploymentPeriod startMonth='invalid' endMonth='2026.12' initialLabels={initialLabels} />
  );
  expect(screen.getByText('invalid - 2026.12')).toBeInTheDocument();
  expect(screen.queryByText('1년')).not.toBeInTheDocument();
});
