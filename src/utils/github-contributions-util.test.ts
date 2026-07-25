/** @jest-environment node */

import type { Activity } from 'react-activity-calendar';
import { fetchGitHubContributions } from './github-contributions-util';

const githubActivity: Activity[] = [
  {
    count: 3,
    date: '2026-07-25',
    level: 2,
  },
];

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });

it('returns GitHub contributions from a successful response', async () => {
  jest
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(jsonResponse({ contributions: githubActivity }));

  await expect(fetchGitHubContributions('toosign00')).resolves.toEqual(githubActivity);
});

it('returns null when GitHub responds with an error', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({}, 500));

  await expect(fetchGitHubContributions('toosign00')).resolves.toBeNull();
});

it('returns null when the contributions payload is not an array', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ contributions: 'invalid' }));

  await expect(fetchGitHubContributions('toosign00')).resolves.toBeNull();
});

it('returns null when the GitHub request fails', async () => {
  jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network unavailable'));

  await expect(fetchGitHubContributions('toosign00')).resolves.toBeNull();
});
