import type { Activity } from 'react-activity-calendar';

const API_URL = 'https://github-contributions-api.jogruber.de/v4';
const REVALIDATE_SECONDS = 900;
const TIMEOUT_MS = 3000;

interface ContributionsApiResponse {
  contributions?: Activity[];
}

export const fetchGitHubContributions = async (username: string): Promise<Activity[] | null> => {
  try {
    const res = await fetch(`${API_URL}/${username}?y=last`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as ContributionsApiResponse;
    return Array.isArray(data.contributions) ? data.contributions : null;
  } catch {
    return null;
  }
};
