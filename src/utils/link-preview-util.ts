import { resolveSafeLinkPreviewAddress } from '@/utils/api-validation-util';
import { requestPinnedUrl } from '@/utils/link-preview-request-util';

export interface LinkPreviewMetadata {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export const MAX_HTML_BYTES = 512_000;
export const MAX_REDIRECTS = 3;

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

export class LinkPreviewError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

const META_CONTENT_PATTERN = (property: string) =>
  new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    'i'
  );

const TITLE_PATTERN = /<title[^>]*>([^<]+)<\/title>/i;
const ICON_PATTERN =
  /<link[^>]+rel=["'][^"']*(?:icon|shortcut icon)[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i;

const resolveUrl = (raw: string | undefined, baseUrl: URL): string | undefined => {
  if (!raw) {
    return undefined;
  }

  try {
    return new URL(raw, baseUrl).toString();
  } catch {
    return undefined;
  }
};

export const parseMetadata = (html: string, sourceUrl: URL): LinkPreviewMetadata => {
  const ogTitle = html.match(META_CONTENT_PATTERN('og:title'))?.[1];
  const titleTag = html.match(TITLE_PATTERN)?.[1]?.trim();
  const description =
    html.match(META_CONTENT_PATTERN('og:description'))?.[1] ??
    html.match(META_CONTENT_PATTERN('description'))?.[1];
  const image = resolveUrl(html.match(META_CONTENT_PATTERN('og:image'))?.[1], sourceUrl);
  const favicon =
    resolveUrl(html.match(ICON_PATTERN)?.[1], sourceUrl) ?? resolveUrl('/favicon.ico', sourceUrl);

  return {
    title: ogTitle ?? titleTag,
    description,
    image,
    favicon,
  };
};

export const readHtml = async (response: Response): Promise<string> => {
  if (!response.body) {
    return '';
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const chunks: string[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    totalBytes += value.byteLength;
    if (totalBytes > MAX_HTML_BYTES) {
      await reader.cancel();
      throw new LinkPreviewError('Target HTML is too large', 413);
    }

    chunks.push(decoder.decode(value, { stream: true }));
  }

  chunks.push(decoder.decode());
  return chunks.join('');
};

interface FetchSafeUrlDependencies {
  resolveAddress?: typeof resolveSafeLinkPreviewAddress;
  request?: typeof requestPinnedUrl;
}

export const fetchSafeUrl = async (
  initialUrl: URL,
  signal: AbortSignal,
  {
    resolveAddress = resolveSafeLinkPreviewAddress,
    request = requestPinnedUrl,
  }: FetchSafeUrlDependencies = {}
): Promise<{ response: Response; sourceUrl: URL }> => {
  let targetUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const resolvedAddress = await resolveAddress(targetUrl);
    if (!resolvedAddress) {
      throw new LinkPreviewError('Blocked private or internal URL', 400);
    }

    const response = await request(targetUrl, resolvedAddress, signal);

    if (!REDIRECT_STATUSES.has(response.status)) {
      return { response, sourceUrl: targetUrl };
    }

    const location = response.headers.get('location');
    if (!location) {
      throw new LinkPreviewError('Failed to fetch target URL', 502);
    }

    targetUrl = new URL(location, targetUrl);
  }

  throw new LinkPreviewError('Too many redirects', 400);
};
