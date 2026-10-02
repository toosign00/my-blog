import { resolveSafeLinkPreviewAddress } from '@/utils/api-validation-util';
import { requestPinnedUrl } from '@/utils/link-preview-request-util';

export interface LinkPreviewMetadata {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export const MAX_HTML_BYTES = 512_000;
export const MAX_METADATA_TAG_LENGTH = 8192;
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

const ATTRIBUTE_PATTERN = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

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
  const tags = /<(meta|link|title)(?=[\s/>])/gi;
  const metadata = new Map<string, string>();
  let titleTag: string | undefined;
  let icon: string | undefined;
  while (true) {
    const tag = tags.exec(html);
    if (!tag) break;
    const attributesStart = tags.lastIndex;
    let end = attributesStart;
    let quote = '';
    // Advance once through each tag; never rescan overlapping suffixes.
    for (; end < html.length; end += 1) {
      if (end - tag.index >= MAX_METADATA_TAG_LENGTH) {
        throw new LinkPreviewError('Target HTML metadata tag is too large', 413);
      }
      const char = html[end];
      if (quote) {
        if (char === quote) quote = '';
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '>' || char === '<') {
        break;
      }
    }
    tags.lastIndex = end + (html[end] === '>' ? 1 : 0);
    if (html[end] !== '>') continue;

    const name = tag[1].toLowerCase();
    if (name === 'title') {
      const close = html.indexOf('<', end + 1);
      if (
        titleTag === undefined &&
        close > end + 1 &&
        /^<\/title>/i.test(html.slice(close, close + 8))
      ) {
        titleTag = html.slice(end + 1, close).trim();
      }
      continue;
    }

    const attributes = new Map<string, string>();
    for (const attribute of html.slice(attributesStart, end).matchAll(ATTRIBUTE_PATTERN)) {
      const key = attribute[1].toLowerCase();
      if (!attributes.has(key)) {
        attributes.set(key, attribute[2] ?? attribute[3] ?? attribute[4] ?? '');
      }
    }
    const content = attributes.get('content');
    if (name === 'meta' && content) {
      for (const key of [attributes.get('property'), attributes.get('name')]) {
        if (key && !metadata.has(key.toLowerCase())) metadata.set(key.toLowerCase(), content);
      }
    } else if (name === 'link' && /icon/i.test(attributes.get('rel') ?? '')) {
      icon ??= attributes.get('href') || undefined;
    }
  }

  return {
    title: metadata.get('og:title') ?? titleTag,
    description: metadata.get('og:description') ?? metadata.get('description'),
    image: resolveUrl(metadata.get('og:image'), sourceUrl),
    favicon: resolveUrl(icon, sourceUrl) ?? resolveUrl('/favicon.ico', sourceUrl),
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

    await response.body?.cancel();
    const location = response.headers.get('location');
    if (!location) {
      throw new LinkPreviewError('Failed to fetch target URL', 502);
    }

    targetUrl = new URL(location, targetUrl);
  }

  throw new LinkPreviewError('Too many redirects', 400);
};
