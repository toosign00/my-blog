import type { ActivityItem as ActivityItemType } from '@/utils/github-activity-util';
import { ActivityItem } from './ActivityItem';

interface ActivityListProps {
  activities: ActivityItemType[];
  loading: boolean;
}

export const ActivityList = ({ activities, loading }: ActivityListProps) => {
  if (loading) {
    return (
      <div className='column h-full w-full gap-2.5 px-5 pb-4'>
        {['s0', 's1', 's2', 's3'].map((k) => (
          <div key={k} className='h-3.5 w-full animate-pulse rounded-sm bg-border' />
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className='center h-full w-full text-gray-light text-sm'>활동 내역이 없습니다.</div>
    );
  }

  return (
    <ul className='column h-full w-full gap-2 overflow-y-auto px-5 pb-4'>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} {...activity} />
      ))}
    </ul>
  );
};
