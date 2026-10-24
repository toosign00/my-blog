import { render, screen } from '@testing-library/react';
import { RelativeTime } from './relativeTime';

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2026-07-25T12:00:00'));
});

afterEach(() => {
  jest.useRealTimers();
});

it('shows the relative time after the component mounts', () => {
  render(<RelativeTime time='2026-07-25T11:55:00' />);

  expect(screen.getByText('5m ago')).toBeInTheDocument();
});
