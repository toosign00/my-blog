import { type ActivityItem, fetchRecentGitHubActivities } from '@/utils/github-activity-util';
import { RecentActivity } from './index';

export const ActivityServer = async () => {
  let activities: ActivityItem[] = [];
  try {
    activities = await fetchRecentGitHubActivities();
  } catch {
    // GitHub API 실패 시 빈 목록으로 graceful degradation
  }
  return <RecentActivity initialActivities={activities} />;
};
