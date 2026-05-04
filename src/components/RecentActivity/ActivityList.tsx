import type { ActivityItem as ActivityItemType } from '@/utils/github-activity-util';
import { ActivityItem } from './ActivityItem';

interface ActivityListProps {
  activities: ActivityItemType[];
}

export const ActivityList = ({ activities }: ActivityListProps) => {
  if (!activities.length) {
    return (
      <div className='center h-full w-full text-gray-light text-sm'>활동 내역이 없습니다.</div>
    );
  }

  return (
    <ul className='subtle-scrollbar column h-full w-full gap-2 overflow-y-auto px-5 pb-4'>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} {...activity} />
      ))}
    </ul>
  );
};
