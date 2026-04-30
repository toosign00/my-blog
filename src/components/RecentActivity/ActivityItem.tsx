import type { ActivityItem as ActivityItemType } from "@/app/api/github/route";

const TYPE_ICON: Record<string, string> = {
  push: "🔨",
  branch: "🌿",
  pr: "🔀",
  star: "⭐",
};

const formatRelative = (dateStr: string): string => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
};

export const ActivityItem = ({
  type,
  repo,
  message,
  url,
  createdAt,
}: ActivityItemType) => (
  <li className="w-full shrink-0">
    <a
      className="row-between w-full gap-2 overflow-hidden rounded-sm transition-opacity duration-150 hover:opacity-60"
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="shrink-0 text-sm">{TYPE_ICON[type]}</span>
      <div className="column min-w-0 flex-1">
        <p className="h6 truncate font-medium text-gray-accent">
          {message || repo}
        </p>
        <p className="h7 text-gray-light">
          {repo} · {formatRelative(createdAt)}
        </p>
      </div>
    </a>
  </li>
);
