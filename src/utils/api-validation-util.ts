import { lookup } from 'node:dns/promises';

const MAX_VIEW_PATHNAME_LENGTH = 160;

export type ResolvedAddress = {
  address: string;
  family: 4 | 6;
};

type LinkPreviewLookup = (hostname: string) => Promise<ResolvedAddress[]>;

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
    (first === 192 && second === 168) ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 192 && second === 0) ||
    (first === 198 && (second === 18 || second === 19)) ||
    first >= 224
  );
};

const mappedIPv4FromIPv6 = (hostname: string): string | null => {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!normalized.startsWith('::ffff:')) {
    return null;
  }

  const suffix = normalized.slice('::ffff:'.length);
  if (isIPv4(suffix)) {
    return suffix;
  }

  const parts = suffix.split(':');
  if (parts.length !== 2) {
    return null;
  }

  const [high, low] = parts.map((part) => Number.parseInt(part, 16));
  if (!Number.isFinite(high) || !Number.isFinite(low)) {
    return null;
  }

  return [(high >> 8) & 255, high & 255, (low >> 8) & 255, low & 255].join('.');
};

const isPrivateIPv6 = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  const mappedIPv4 = mappedIPv4FromIPv6(normalized);
  if (normalized.startsWith('::ffff:')) {
    return mappedIPv4 === null || isPrivateIPv4(mappedIPv4);
  }

  return (
    normalized === '::' ||
    normalized === '::1' ||
    normalized === '0:0:0:0:0:0:0:1' ||
    normalized.startsWith('fc') ||
    normalized.startsWith('fd') ||
    /^fe[89ab]/.test(normalized) ||
    normalized.startsWith('ff')
  );
};

const isInternalHostname = (hostname: string): boolean => {
  const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, '');

  return (
    normalized === 'localhost' ||
    normalized === '::1' ||
    normalized === '0:0:0:0:0:0:0:1' ||
    isPrivateIPv4(normalized) ||
    isPrivateIPv6(normalized)
  );
};

export const isSafeLinkPreviewUrl = (url: URL): boolean => {
  if (!['http:', 'https:'].includes(url.protocol)) {
    return false;
  }

  return !isInternalHostname(url.hostname);
};

const defaultLinkPreviewLookup: LinkPreviewLookup = async (hostname) => {
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  return addresses.filter(
    (address): address is ResolvedAddress => address.family === 4 || address.family === 6
  );
};

export const resolveSafeLinkPreviewAddress = async (
  url: URL,
  resolveHostname: LinkPreviewLookup = defaultLinkPreviewLookup
): Promise<ResolvedAddress | null> => {
  if (!isSafeLinkPreviewUrl(url)) {
    return null;
  }

  try {
    const addresses = await resolveHostname(url.hostname);
    if (addresses.length === 0 || addresses.some(({ address }) => isInternalHostname(address))) {
      return null;
    }

    return addresses[0];
  } catch {
    return null;
  }
};

export const isSafeLinkPreviewResolvedUrl = async (
  url: URL,
  resolveHostname: LinkPreviewLookup = defaultLinkPreviewLookup
): Promise<boolean> => (await resolveSafeLinkPreviewAddress(url, resolveHostname)) !== null;

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
