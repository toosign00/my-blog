import { NextResponse } from 'next/server';
import { isHtmlContentType, resolveSafeLinkPreviewAddress } from '@/utils/api-validation-util';
import { requestPinnedUrl } from '@/utils/link-preview-request-util';

interface LinkPreviewResponse {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}

export const revalidate = 3600;
const FETCH_TIMEOUT_MS = 5000;
const MAX_HTML_BYTES = 512_000;
const MAX_REDIRECTS = 3;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

class LinkPreviewError extends Error {
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

const parseMetadata = (html: string, sourceUrl: URL): LinkPreviewResponse => {
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

const readHtml = async (response: Response): Promise<string> => {
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

const fetchSafeUrl = async (
  initialUrl: URL,
  signal: AbortSignal
): Promise<{ response: Response; sourceUrl: URL }> => {
  let targetUrl = initialUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const resolvedAddress = await resolveSafeLinkPreviewAddress(targetUrl);
    if (!resolvedAddress) {
      throw new LinkPreviewError('Blocked private or internal URL', 400);
    }

    const response = await requestPinnedUrl(targetUrl, resolvedAddress, signal);

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

export const GET = async (
  request: Request
): Promise<NextResponse<LinkPreviewResponse | { error: string }>> => {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url query parameter' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(targetUrl.protocol)) {
    return NextResponse.json({ error: 'Unsupported protocol' }, { status: 400 });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const { response, sourceUrl } = await fetchSafeUrl(targetUrl, controller.signal);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch target URL' }, { status: 502 });
    }

    if (!isHtmlContentType(response.headers.get('content-type'))) {
      return NextResponse.json({ error: 'Target URL did not return HTML' }, { status: 415 });
    }

    const html = await readHtml(response);

    const metadata = parseMetadata(html, sourceUrl);
    return NextResponse.json(metadata);
  } catch (error) {
    if (error instanceof LinkPreviewError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: 'Failed to parse metadata' }, { status: 500 });
  } finally {
    clearTimeout(timeoutId);
  }
};
