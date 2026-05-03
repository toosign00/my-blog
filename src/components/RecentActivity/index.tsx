'use client';

import { useState } from 'react';
import type { ActivityItem } from '@/utils/github-activity-util';
import { ActivityFilter, type FilterType } from './ActivityFilter';
import { ActivityList } from './ActivityList';

interface RecentActivityProps {
  initialActivities: ActivityItem[];
}

export const RecentActivity = ({ initialActivities }: RecentActivityProps) => {
  const [activities] = useState<ActivityItem[]>(initialActivities);
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className='column h-full w-full overflow-hidden'>
      <ActivityFilter onChange={setFilter} value={filter} />
      <ActivityList activities={filtered} loading={false} />
    </div>
  );
};
