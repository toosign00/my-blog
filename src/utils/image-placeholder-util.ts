import { cache } from 'react';
import sharp from 'sharp';

export type RemoteImagePlaceholder = {
  width: number;
  height: number;
  blurDataURL: string;
};

const CACHE_VERSION = 'v1';
const REMOTE_IMAGE_HOST = 'files.toosign.me';
const PLACEHOLDER_SIZE = 10;
const WEBP_QUALITY = 40;

const getKvBase = (): string | null => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const namespaceId = process.env.CLOUDFLARE_IMAGE_SIZES_KV_NAMESPACE_ID;

  if (!accountId || !namespaceId) {
    return null;
  }

  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}`;
};

const getKvHeaders = (): HeadersInit | null => {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!apiToken) {
    return null;
  }

  return {
    Authorization: `Bearer ${apiToken}`,
  };
};

const isRemoteImagePlaceholder = (value: unknown): value is RemoteImagePlaceholder => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const placeholder = value as Partial<RemoteImagePlaceholder>;
  return (
    typeof placeholder.width === 'number' &&
    placeholder.width > 0 &&
    typeof placeholder.height === 'number' &&
    placeholder.height > 0 &&
    typeof placeholder.blurDataURL === 'string' &&
    placeholder.blurDataURL.startsWith('data:image/')
  );
};

const parseRemoteImageUrl = (src: string): URL | null => {
  try {
    const url = new URL(src);
    if (url.protocol !== 'https:' || url.hostname !== REMOTE_IMAGE_HOST) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
};

const getCacheKey = (src: string): string => `image-placeholder:${CACHE_VERSION}:${src}`;

const readCache = async (key: string): Promise<RemoteImagePlaceholder | null> => {
  const kvBase = getKvBase();
  const headers = getKvHeaders();
  if (!kvBase || !headers) {
    return null;
  }

  try {
    const response = await fetch(`${kvBase}/values/${encodeURIComponent(key)}`, { headers });
    if (!response.ok) {
      return null;
    }

    const value: unknown = await response.json();
    return isRemoteImagePlaceholder(value) ? value : null;
  } catch {
    return null;
  }
};

const writeCache = async (key: string, value: RemoteImagePlaceholder): Promise<void> => {
  const kvBase = getKvBase();
  const headers = getKvHeaders();
  if (!kvBase || !headers) {
    return;
  }

  const form = new FormData();
  form.append('value', JSON.stringify(value));
  form.append('metadata', '{}');

  try {
    await fetch(`${kvBase}/values/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers,
      body: form,
    });
  } catch {
    // The generated placeholder can still be used for this render.
  }
};

const fetchSource = async (url: URL): Promise<Buffer> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
};

const createPlaceholder = async (buffer: Buffer): Promise<RemoteImagePlaceholder> => {
  const metadata = await sharp(buffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error('Image dimensions are unavailable');
  }

  const data = await sharp(buffer)
    .resize(PLACEHOLDER_SIZE, PLACEHOLDER_SIZE, { fit: 'inside' })
    .blur(2)
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  return {
    width: metadata.width,
    height: metadata.height,
    blurDataURL: `data:image/webp;base64,${data.toString('base64')}`,
  };
};

export const getRemoteImagePlaceholder = cache(
  async (src: string): Promise<RemoteImagePlaceholder | null> => {
    const url = parseRemoteImageUrl(src);
    if (!url) {
      return null;
    }

    const cacheKey = getCacheKey(src);
    const cachedPlaceholder = await readCache(cacheKey);
    if (cachedPlaceholder) {
      return cachedPlaceholder;
    }

    try {
      const buffer = await fetchSource(url);
      const placeholder = await createPlaceholder(buffer);
      await writeCache(cacheKey, placeholder);
      return placeholder;
    } catch {
      return null;
    }
  }
);
