import type { ActivityItem as ActivityItemType } from "@/app/api/github/route";
import { ActivityItem } from "./ActivityItem";

interface ActivityListProps {
  activities: ActivityItemType[];
  loading: boolean;
}

export const ActivityList = ({ activities, loading }: ActivityListProps) => {
  if (loading) {
    return (
      <div className="column h-full w-full gap-[0.625rem] px-[1.25rem] pb-[1rem]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
            key={i}
            className="h-[0.875rem] w-full animate-pulse rounded-sm bg-[var(--color-border)]"
          />
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="center h-full w-full text-[var(--color-gray-light)] text-sm">
        활동 내역이 없습니다.
      </div>
    );
  }

  return (
    <ul className="column h-full w-full gap-[0.5rem] overflow-y-auto px-[1.25rem] pb-[1rem]">
      {activities.map((activity) => (
        <ActivityItem
          key={`${activity.repo}-${activity.createdAt}`}
          {...activity}
        />
      ))}
    </ul>
  );
};
