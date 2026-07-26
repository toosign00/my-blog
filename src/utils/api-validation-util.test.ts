import { lookup } from 'node:dns/promises';
import {
  isAllowedViewPathname,
  isHtmlContentType,
  isSafeLinkPreviewResolvedUrl,
  isSafeLinkPreviewUrl,
  type ResolvedAddress,
  resolveSafeLinkPreviewAddress,
} from './api-validation-util';

jest.mock('node:dns/promises', () => ({
  lookup: jest.fn(),
}));

const resolvedAddress = (address: string, family: 4 | 6 = 4): ResolvedAddress => ({
  address,
  family,
});

const mockLookup = lookup as unknown as jest.MockedFunction<
  (hostname: string, options: { all: true; verbatim: true }) => Promise<ResolvedAddress[]>
>;

describe('isSafeLinkPreviewUrl', () => {
  it.each(['http://example.com', 'https://example.com'])('allows a public web URL: %s', (url) => {
    expect(isSafeLinkPreviewUrl(new URL(url))).toBe(true);
  });

  it.each(['ftp://example.com', 'file:///etc/passwd'])('rejects a non-web protocol: %s', (url) => {
    expect(isSafeLinkPreviewUrl(new URL(url))).toBe(false);
  });

  it.each([
    'http://localhost',
    'http://0.0.0.0',
    'http://10.0.0.1',
    'http://100.64.0.1',
    'http://127.0.0.1',
    'http://169.254.0.1',
    'http://172.16.0.1',
    'http://192.0.0.1',
    'http://192.168.0.1',
    'http://198.18.0.1',
    'http://224.0.0.1',
  ])('rejects a local or reserved IPv4 destination: %s', (url) => {
    expect(isSafeLinkPreviewUrl(new URL(url))).toBe(false);
  });

  it.each([
    'http://[::]',
    'http://[::1]',
    'http://[0:0:0:0:0:0:0:1]',
    'http://[fc00::1]',
    'http://[fd00::1]',
    'http://[fe80::1]',
    'http://[ff00::1]',
    'http://[::ffff:127.0.0.1]',
    'http://[::ffff:7f00:1]',
  ])('rejects a local or reserved IPv6 destination: %s', (url) => {
    expect(isSafeLinkPreviewUrl(new URL(url))).toBe(false);
  });

  it.each([
    'http://100.63.255.255',
    'http://100.128.0.1',
    'http://172.15.255.255',
    'http://172.32.0.1',
    'http://198.17.255.255',
    'http://198.20.0.1',
    'http://223.255.255.255',
    'http://[2001:4860:4860::8888]',
  ])('does not block a public address next to a reserved range: %s', (url) => {
    expect(isSafeLinkPreviewUrl(new URL(url))).toBe(true);
  });
});

describe('resolveSafeLinkPreviewAddress', () => {
  it('uses the system DNS lookup with rebinding-safe options by default', async () => {
    mockLookup.mockResolvedValue([
      resolvedAddress('93.184.216.34'),
      resolvedAddress('2606:2800:220:1::', 6),
    ]);

    await expect(resolveSafeLinkPreviewAddress(new URL('https://example.com'))).resolves.toEqual(
      resolvedAddress('93.184.216.34')
    );
    expect(lookup).toHaveBeenCalledWith('example.com', {
      all: true,
      verbatim: true,
    });
  });

  it('returns the first address when every resolved address is public', async () => {
    const firstAddress = resolvedAddress('93.184.216.34');
    const resolveHostname = jest
      .fn()
      .mockResolvedValue([firstAddress, resolvedAddress('2606:2800:220:1::', 6)]);

    await expect(
      resolveSafeLinkPreviewAddress(new URL('https://example.com'), resolveHostname)
    ).resolves.toEqual(firstAddress);
  });

  it('rejects an explicitly internal URL without resolving its hostname', async () => {
    const resolveHostname = jest.fn();

    await expect(
      resolveSafeLinkPreviewAddress(new URL('http://localhost'), resolveHostname)
    ).resolves.toBeNull();
    expect(resolveHostname).not.toHaveBeenCalled();
  });

  it('rejects an empty DNS result', async () => {
    const resolveHostname = jest.fn().mockResolvedValue([]);

    await expect(
      resolveSafeLinkPreviewAddress(new URL('https://example.com'), resolveHostname)
    ).resolves.toBeNull();
  });

  it('rejects the entire DNS result when any address is internal', async () => {
    const resolveHostname = jest
      .fn()
      .mockResolvedValue([resolvedAddress('93.184.216.34'), resolvedAddress('127.0.0.1')]);

    await expect(
      resolveSafeLinkPreviewAddress(new URL('https://example.com'), resolveHostname)
    ).resolves.toBeNull();
  });

  it('rejects a private IPv4 address returned in IPv6-mapped decimal form', async () => {
    const resolveHostname = jest.fn().mockResolvedValue([resolvedAddress('::ffff:127.0.0.1', 6)]);

    await expect(
      resolveSafeLinkPreviewAddress(new URL('https://example.com'), resolveHostname)
    ).resolves.toBeNull();
  });

  it.each(['::ffff:abcd', '::ffff:zzzz:1'])(
    'rejects an invalid IPv4-mapped address returned by DNS: %s',
    async (address) => {
      const resolveHostname = jest.fn().mockResolvedValue([resolvedAddress(address, 6)]);

      await expect(
        resolveSafeLinkPreviewAddress(new URL('https://example.com'), resolveHostname)
      ).resolves.toBeNull();
    }
  );

  it('rejects a hostname when DNS resolution fails', async () => {
    const resolveHostname = jest.fn().mockRejectedValue(new Error('DNS unavailable'));

    await expect(
      resolveSafeLinkPreviewAddress(new URL('https://example.com'), resolveHostname)
    ).resolves.toBeNull();
  });
});

describe('isSafeLinkPreviewResolvedUrl', () => {
  it('reports whether the URL resolves exclusively to public addresses', async () => {
    const resolvePublicHostname = jest.fn().mockResolvedValue([resolvedAddress('93.184.216.34')]);
    const resolvePrivateHostname = jest.fn().mockResolvedValue([resolvedAddress('10.0.0.1')]);
    const url = new URL('https://example.com');

    await expect(isSafeLinkPreviewResolvedUrl(url, resolvePublicHostname)).resolves.toBe(true);
    await expect(isSafeLinkPreviewResolvedUrl(url, resolvePrivateHostname)).resolves.toBe(false);
  });
});

describe('isHtmlContentType', () => {
  it.each(['text/html', 'TEXT/HTML', ' text/html ; charset=utf-8'])(
    'accepts an HTML media type: %s',
    (contentType) => {
      expect(isHtmlContentType(contentType)).toBe(true);
    }
  );

  it.each([null, '', 'application/json', 'application/xhtml+xml'])(
    'rejects a non-HTML media type: %s',
    (contentType) => {
      expect(isHtmlContentType(contentType)).toBe(false);
    }
  );
});

describe('isAllowedViewPathname', () => {
  const postSlugs = ['first-post', 'second-post'];

  it.each(['/', '/posts/first-post', '/posts/second-post'])(
    'allows a known countable pathname: %s',
    (pathname) => {
      expect(isAllowedViewPathname(pathname, postSlugs)).toBe(true);
    }
  );

  it.each([
    '',
    'posts/first-post',
    '/posts/unknown',
    '/posts/first-post/extra',
    '/posts/first-post?preview=true',
    '/posts/first-post#comments',
    `/${'a'.repeat(160)}`,
  ])('rejects an uncountable pathname: %s', (pathname) => {
    expect(isAllowedViewPathname(pathname, postSlugs)).toBe(false);
  });
});
