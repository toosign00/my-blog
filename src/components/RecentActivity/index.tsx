"use client";

import { useEffect, useState } from "react";
import type { ActivityItem } from "@/app/api/github/route";
import { ActivityFilter, type FilterType } from "./ActivityFilter";
import { ActivityList } from "./ActivityList";

export const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetch("/api/github")
      .then((r) => r.json())
      .then((data) => {
        setActivities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? activities : activities.filter((a) => a.type === filter);

  return (
    <div className="column h-full w-full overflow-hidden">
      <ActivityFilter onChange={setFilter} value={filter} />
      <ActivityList activities={filtered} loading={loading} />
    </div>
  );
};
