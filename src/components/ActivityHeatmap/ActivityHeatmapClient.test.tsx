import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Activity } from 'react-activity-calendar';
import { ActivityHeatmapClient } from './ActivityHeatmapClient';

let mockResolvedTheme: 'light' | 'dark' = 'light';

jest.mock('next-themes', () => ({
  useTheme: () => ({
    forcedTheme: undefined,
    resolvedTheme: mockResolvedTheme,
    setTheme: jest.fn(),
    systemTheme: 'light',
    theme: mockResolvedTheme,
    themes: ['light', 'dark'],
  }),
}));

const githubActivity: Activity[] = [
  {
    count: 3,
    date: '2026-07-25',
    level: 2,
  },
];

beforeEach(() => {
  mockResolvedTheme = 'light';
});

it('exposes the GitHub contributions panel as a named region', async () => {
  render(<ActivityHeatmapClient githubActivity={githubActivity} />);

  expect(
    await screen.findByRole('region', {
      name: 'GitHub Contributions',
    })
  ).toBeInTheDocument();
});

it('does not expose the GitHub contributions panel without activity data', () => {
  render(<ActivityHeatmapClient githubActivity={null} />);

  expect(
    screen.queryByRole('region', {
      name: 'GitHub Contributions',
    })
  ).not.toBeInTheDocument();
});

it('shows contribution details while a day is hovered', async () => {
  const user = userEvent.setup();
  render(<ActivityHeatmapClient githubActivity={githubActivity} />);

  await user.hover(
    await screen.findByRole('img', {
      name: '2026-07-25: 3개 기여',
    })
  );

  expect(screen.getByRole('tooltip')).toHaveTextContent('2026-07-25: 3개 기여');
});

it('hides contribution details when the pointer leaves a day', async () => {
  const user = userEvent.setup();
  render(<ActivityHeatmapClient githubActivity={githubActivity} />);
  const day = await screen.findByRole('img', {
    name: '2026-07-25: 3개 기여',
  });

  await user.hover(day);
  const tooltip = screen.getByRole('tooltip');
  await user.unhover(day);

  expect(tooltip).toHaveAttribute('aria-hidden', 'true');
});

it('uses the dark color scheme for contribution cells in dark mode', async () => {
  mockResolvedTheme = 'dark';

  render(<ActivityHeatmapClient githubActivity={githubActivity} />);

  expect(
    await screen.findByRole('img', {
      name: '2026-07-25: 3개 기여',
    })
  ).toHaveStyle({
    stroke: 'rgba(255, 255, 255, 0.04)',
  });
});
