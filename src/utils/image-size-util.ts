const KV_BASE = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${process.env.CLOUDFLARE_IMAGE_SIZES_KV_NAMESPACE_ID}`;

type ImageSize = { width: number; height: number };

const kvHeaders = () => ({
  Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
});

const kvGet = async (key: string): Promise<ImageSize | null> => {
  const res = await fetch(`${KV_BASE}/values/${encodeURIComponent(key)}`, {
    headers: kvHeaders(),
  });
  if (!res.ok) return null;
  try {
    return (await res.json()) as ImageSize;
  } catch {
    return null;
  }
};

const kvPut = async (key: string, value: ImageSize): Promise<void> => {
  const form = new FormData();
  form.append('value', JSON.stringify(value));
  form.append('metadata', '{}');
  await fetch(`${KV_BASE}/values/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: kvHeaders(),
    body: form,
  });
};

const fetchImageSize = async (url: string): Promise<ImageSize | null> => {
  try {
    const metaUrl = url.replace(/^(https:\/\/[^/]+)\/(.+)$/, '$1/cdn-cgi/image/format=json/$2');
    const res = await fetch(metaUrl);
    if (!res.ok) return null;
    const { width, height } = (await res.json()) as ImageSize;
    if (!width || !height) return null;
    return { width, height };
  } catch {
    return null;
  }
};

export const getImageSize = async (url: string): Promise<ImageSize | null> => {
  const cached = await kvGet(url);
  if (cached) return cached;

  const size = await fetchImageSize(url);
  if (size) await kvPut(url, size);
  return size;
};
