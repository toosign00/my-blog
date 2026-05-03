export const GITHUB_ACTIVITY_REVALIDATE_SECONDS = 3600;

interface GitHubEvent {
  id: string | number;
  type: string;
  repo: { name: string };
  payload: {
    commits?: { message: string }[];
    ref?: string;
    ref_type?: string;
    pull_request?: { title: string; html_url: string };
  };
  created_at: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  repo: string;
  message: string;
  url: string;
  createdAt: string;
}

const formatEvent = (event: GitHubEvent): ActivityItem | null => {
  const repoFull = event.repo.name;
  const repo = repoFull.split('/')[1];
  const baseUrl = `https://github.com/${repoFull}`;
  const id = String(event.id);

  switch (event.type) {
    case 'PushEvent': {
      const count = event.payload.commits?.length ?? 0;
      const message = event.payload.commits?.[0]?.message ?? '';
      return {
        id,
        type: 'push',
        repo,
        message: count > 1 ? `${message} 외 ${count - 1}개` : message,
        url: `${baseUrl}/commits`,
        createdAt: event.created_at,
      };
    }
    case 'CreateEvent':
      if (event.payload.ref_type === 'branch') {
        return {
          id,
          type: 'branch',
          repo,
          message: event.payload.ref ?? '',
          url: `${baseUrl}/tree/${event.payload.ref}`,
          createdAt: event.created_at,
        };
      }
      return null;
    case 'PullRequestEvent':
      return {
        id,
        type: 'pr',
        repo,
        message: event.payload.pull_request?.title ?? '',
        url: event.payload.pull_request?.html_url ?? baseUrl,
        createdAt: event.created_at,
      };
    case 'WatchEvent':
      return {
        id,
        type: 'star',
        repo,
        message: repo,
        url: baseUrl,
        createdAt: event.created_at,
      };
    default:
      return null;
  }
};

export const fetchRecentGitHubActivities = async (): Promise<ActivityItem[]> => {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  if (!token) {
    throw new Error('Missing GITHUB_PERSONAL_ACCESS_TOKEN');
  }

  const res = await fetch('https://api.github.com/users/toosign00/events/public?per_page=30', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
    next: { revalidate: GITHUB_ACTIVITY_REVALIDATE_SECONDS },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch GitHub activities');
  }

  const events = (await res.json()) as GitHubEvent[];
  return events
    .map(formatEvent)
    .filter((activity): activity is ActivityItem => activity !== null)
    .slice(0, 30);
};
