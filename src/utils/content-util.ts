type CoverAssetType = 'posts' | 'projects';

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

export const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every(isNonEmptyString);
};

export const isValidDateString = (value: string) => {
  return Number.isFinite(Date.parse(value));
};

export const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isRemoteImage = (value: string) => {
  return value.startsWith('https://');
};

export const resolveCoverAsset = (type: CoverAssetType, slug: string, asset: string): string => {
  if (isRemoteImage(asset)) {
    return asset;
  }

  return `/covers/${type}/${slug}/${asset.replace(/^\.\//, '')}`;
};
