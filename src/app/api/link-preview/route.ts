import { NextResponse } from "next/server";

interface LinkPreviewResponse {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}

const LINK_PREVIEW_REVALIDATE_SECONDS = 3600;
export const revalidate = 3600;
const FETCH_TIMEOUT_MS = 5000;

const META_CONTENT_PATTERN = (property: string) =>
  new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i",
  );

const TITLE_PATTERN = /<title[^>]*>([^<]+)<\/title>/i;
const ICON_PATTERN =
  /<link[^>]+rel=["'][^"']*(?:icon|shortcut icon)[^"']*["'][^>]+href=["']([^"']+)["'][^>]*>/i;

const resolveUrl = (
  raw: string | undefined,
  baseUrl: URL,
): string | undefined => {
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
  const ogTitle = html.match(META_CONTENT_PATTERN("og:title"))?.[1];
  const titleTag = html.match(TITLE_PATTERN)?.[1]?.trim();
  const description =
    html.match(META_CONTENT_PATTERN("og:description"))?.[1] ??
    html.match(META_CONTENT_PATTERN("description"))?.[1];
  const image = resolveUrl(
    html.match(META_CONTENT_PATTERN("og:image"))?.[1],
    sourceUrl,
  );
  const favicon =
    resolveUrl(html.match(ICON_PATTERN)?.[1], sourceUrl) ??
    resolveUrl("/favicon.ico", sourceUrl);

  return {
    title: ogTitle ?? titleTag,
    description,
    image,
    favicon,
  };
};

export const GET = async (
  request: Request,
): Promise<NextResponse<LinkPreviewResponse | { error: string }>> => {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json(
      { error: "Missing url query parameter" },
      { status: 400 },
    );
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(targetUrl.protocol)) {
    return NextResponse.json(
      { error: "Unsupported protocol" },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "my-blog-link-preview-bot/1.0",
      },
      next: { revalidate: LINK_PREVIEW_REVALIDATE_SECONDS },
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch target URL" },
        { status: 502 },
      );
    }

    const html = await response.text();
    const metadata = parseMetadata(html, targetUrl);
    return NextResponse.json(metadata);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse metadata" },
      { status: 500 },
    );
  } finally {
    clearTimeout(timeoutId);
  }
};
