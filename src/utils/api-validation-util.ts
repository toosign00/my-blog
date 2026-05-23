import path from 'node:path';

const MAX_VIEW_PATHNAME_LENGTH = 160;
const ALLOWED_COVER_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif']);

const isIPv4 = (hostname: string): boolean => {
  const parts = hostname.split('.');
  return parts.length === 4 && parts.every((part) => /^\d+$/.test(part) && Number(part) <= 255);
};

const isPrivateIPv4 = (hostname: string): boolean => {
  if (!isIPv4(hostname)) {
    return false;
  }

  const [first, second] = hostname.split('.').map(Number);
  return (
    first === 10 ||
    first === 127 ||
    first === 0 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
};

const isInternalHostname = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  return (
    normalized === 'localhost' ||
    normalized === '::1' ||
    normalized === '0:0:0:0:0:0:0:1' ||
    isPrivateIPv4(normalized)
  );
};

export const isSafeLinkPreviewUrl = (url: URL): boolean => {
  if (!['http:', 'https:'].includes(url.protocol)) {
    return false;
  }

  return !isInternalHostname(url.hostname);
};

export const isHtmlContentType = (contentType: string | null): boolean => {
  if (!contentType) {
    return false;
  }

  return contentType.toLowerCase().split(';')[0].trim() === 'text/html';
};

export const isAllowedViewPathname = (pathname: string, postSlugs: readonly string[]): boolean => {
  if (pathname.length === 0 || pathname.length > MAX_VIEW_PATHNAME_LENGTH) {
    return false;
  }

  if (!pathname.startsWith('/') || pathname.includes('?') || pathname.includes('#')) {
    return false;
  }

  if (pathname === '/') {
    return true;
  }

  return postSlugs.some((slug) => pathname === `/posts/${slug}`);
};

export const resolveSafeCoverPath = (articlesRoot: string, segments: string[]): string | null => {
  const root = path.resolve(articlesRoot);
  const resolved = path.resolve(root, ...segments);
  const relative = path.relative(root, resolved);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }

  if (!ALLOWED_COVER_EXTENSIONS.has(path.extname(resolved).toLowerCase())) {
    return null;
  }

  return resolved;
};
