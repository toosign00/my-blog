import { NextResponse } from 'next/server';
import { isHtmlContentType } from '@/utils/api-validation-util';
import {
  fetchSafeUrl,
  LinkPreviewError,
  type LinkPreviewMetadata,
  parseMetadata,
  readHtml,
} from '@/utils/link-preview-util';

export const revalidate = 3600;
const FETCH_TIMEOUT_MS = 5000;

export const GET = async (
  request: Request
): Promise<NextResponse<LinkPreviewMetadata | { error: string }>> => {
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
