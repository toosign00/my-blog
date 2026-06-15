import { isAllowedViewPathname } from './api-validation-util';
import type { Views } from './views-util';

export const MAX_BATCH_VIEW_PATHNAMES = 10;

export interface ViewCountRow {
  pathname: string;
  total: number;
}

export const normalizeBatchViewPathnames = (
  pathnames: readonly string[],
  postSlugs: readonly string[]
): string[] | null => {
  const uniquePathnames = [...new Set(pathnames)];

  if (
    uniquePathnames.length === 0 ||
    uniquePathnames.length > MAX_BATCH_VIEW_PATHNAMES ||
    uniquePathnames.some((pathname) => !isAllowedViewPathname(pathname, postSlugs))
  ) {
    return null;
  }

  return uniquePathnames;
};

export const mapBatchViews = (
  pathnames: readonly string[],
  rows: readonly ViewCountRow[]
): Record<string, Views> => {
  const totals = new Map(rows.map((row) => [row.pathname, row.total]));

  return Object.fromEntries(
    pathnames.map((pathname) => [pathname, { today: 0, total: totals.get(pathname) ?? 0 }])
  );
};
