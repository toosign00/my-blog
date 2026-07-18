export const getLatestDate = <T>(
  items: readonly T[],
  getDate: (item: T) => string | undefined
): string | undefined => {
  let latest: string | undefined;

  for (const item of items) {
    const date = getDate(item);
    if (date && (!latest || Date.parse(date) > Date.parse(latest))) {
      latest = date;
    }
  }

  return latest;
};

export const toIsoDate = (value: string | Date): string =>
  (value instanceof Date ? value : new Date(value)).toISOString();
