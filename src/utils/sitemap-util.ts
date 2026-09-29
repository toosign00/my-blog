export const getLatestDate = <T>(
  items: readonly T[],
  getDate: (item: T) => string | undefined
): string | undefined => {
  let latest: string | undefined;

  for (const item of items) {
    const date = getDate(item);
    const time = date ? Date.parse(date) : Number.NaN;

    if (Number.isFinite(time) && (!latest || time > Date.parse(latest))) {
      latest = date;
    }
  }

  return latest;
};

interface PostDateSource {
  createdAt: string;
  modifiedAt?: string;
}

export const getLatestPostDate = <T extends PostDateSource>(
  posts: readonly T[],
  matches: (post: T) => boolean = () => true
): string | undefined =>
  getLatestDate(
    posts.filter((post) => matches(post)),
    ({ modifiedAt, createdAt }) => modifiedAt ?? createdAt
  );

export const getLatestProjectDate = (
  projects: readonly { modifiedAt: string }[]
): string | undefined => getLatestDate(projects, ({ modifiedAt }) => modifiedAt);

export const toIsoDate = (value: string | Date): string =>
  (value instanceof Date ? value : new Date(value)).toISOString();
