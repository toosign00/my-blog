import { fetchGitHubContributions } from '@/utils/github-contributions-util';
import { ActivityHeatmapClient } from './ActivityHeatmapClient';

export interface PostActivityData {
  date: string; // 'YYYY-MM-DD'
  count: number;
}

const GITHUB_USERNAME = 'toosign00';

export const ActivityHeatmap = async () => {
  const githubActivity = await fetchGitHubContributions(GITHUB_USERNAME);
  return <ActivityHeatmapClient githubActivity={githubActivity} />;
};
