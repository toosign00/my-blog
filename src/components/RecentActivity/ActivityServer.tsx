import { fetchRecentGitHubActivities } from '@/utils/github-activity-util';
import { RecentActivity } from './index';

export const ActivityServer = async () => {
  const activities = await fetchRecentGitHubActivities();
  return <RecentActivity initialActivities={activities} />;
};
