import dayjs from 'dayjs';

export const formatTime = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format);
};

export const formatRelativeTime = (date: string | Date): string => {
  const now = dayjs();
  const target = dayjs(date);

  const diffSeconds = now.diff(target, 'second');
  if (diffSeconds < 60) {
    return 'just now';
  }

  const diffMinutes = now.diff(target, 'minute');
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = now.diff(target, 'hour');
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return target.format('YYYY. M. D.');
};
