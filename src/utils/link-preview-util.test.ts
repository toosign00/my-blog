/**
 * @jest-environment node
 */
import type { ResolvedAddress } from './api-validation-util';
import {
  fetchSafeUrl,
  LinkPreviewError,
  MAX_HTML_BYTES,
  MAX_REDIRECTS,
  parseMetadata,
  readHtml,
} from './link-preview-util';

const SOURCE_URL = new URL('https://example.com/articles/hello');

const createHtmlResponse = (chunks: string[]): Response => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });

  return new Response(stream);
};

describe('parseMetadata', () => {
  it('prefers the og:title over the title tag', () => {
    const html = `<title>Title tag</title><meta property="og:title" content="OG title">`;

    expect(parseMetadata(html, SOURCE_URL).title).toBe('OG title');
  });

  it('falls back to the trimmed title tag when there is no og:title', () => {
    expect(parseMetadata('<title>  Title tag  </title>', SOURCE_URL).title).toBe('Title tag');
  });

  it('leaves the title undefined when the document has neither', () => {
    expect(parseMetadata('<html></html>', SOURCE_URL).title).toBeUndefined();
  });

  it('prefers the og:description over the description meta', () => {
    const html = `<meta property="og:description" content="OG description"><meta name="description" content="Plain description">`;

    expect(parseMetadata(html, SOURCE_URL).description).toBe('OG description');
  });

  it('leaves the description undefined when the document declares neither', () => {
    expect(parseMetadata('<html></html>', SOURCE_URL).description).toBeUndefined();
  });

  it('falls back to the description meta when there is no og:description', () => {
    const html = `<meta name="description" content="Plain description">`;

    expect(parseMetadata(html, SOURCE_URL).description).toBe('Plain description');
  });

  it('resolves a relative og:image against the source URL', () => {
    const html = `<meta property="og:image" content="../images/cover.png">`;

    expect(parseMetadata(html, SOURCE_URL).image).toBe('https://example.com/images/cover.png');
  });

  it('leaves the image undefined when the og:image cannot be resolved', () => {
    const html = `<meta property="og:image" content="http://[invalid">`;

    expect(parseMetadata(html, SOURCE_URL).image).toBeUndefined();
  });

  it('resolves the icon link against the source URL', () => {
    const html = `<link rel="shortcut icon" href="/assets/icon.png">`;

    expect(parseMetadata(html, SOURCE_URL).favicon).toBe('https://example.com/assets/icon.png');
  });

  it('falls back to the root favicon when the document declares no icon', () => {
    expect(parseMetadata('<html></html>', SOURCE_URL).favicon).toBe(
      'https://example.com/favicon.ico'
    );
  });
});

describe('readHtml', () => {
  it('returns the concatenated body', async () => {
    await expect(
      readHtml(createHtmlResponse(['<html>', '<title>Hi</title>', '</html>']))
    ).resolves.toBe('<html><title>Hi</title></html>');
  });

  it('returns an empty string when the response has no body', async () => {
    await expect(readHtml(new Response(null))).resolves.toBe('');
  });

  it('decodes a multi-byte character split across two chunks', async () => {
    const encoded = new TextEncoder().encode('한글');
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoded.slice(0, 2));
        controller.enqueue(encoded.slice(2));
        controller.close();
      },
    });

    await expect(readHtml(new Response(stream))).resolves.toBe('한글');
  });

  it('rejects with a 413 error when the body exceeds the size limit', async () => {
    const oversized = createHtmlResponse(['a'.repeat(MAX_HTML_BYTES), 'a']);

    await expect(readHtml(oversized)).rejects.toMatchObject({
      message: 'Target HTML is too large',
      status: 413,
    });
  });
});

describe('fetchSafeUrl', () => {
  const address: ResolvedAddress = { address: '93.184.216.34', family: 4 };
  const signal = new AbortController().signal;

  const redirectTo = (location: string) =>
    new Response(null, { status: 302, headers: { location } });

  it('returns the response and the URL it came from', async () => {
    const response = new Response('<html></html>', { status: 200 });
    const request = jest.fn().mockResolvedValue(response);

    const result = await fetchSafeUrl(SOURCE_URL, signal, {
      resolveAddress: jest.fn().mockResolvedValue(address),
      request,
    });

    expect(result.response).toBe(response);
    expect(result.sourceUrl).toBe(SOURCE_URL);
  });

  it('rejects a URL that resolves to a blocked address without requesting it', async () => {
    const request = jest.fn();

    await expect(
      fetchSafeUrl(SOURCE_URL, signal, {
        resolveAddress: jest.fn().mockResolvedValue(null),
        request,
      })
    ).rejects.toMatchObject({ message: 'Blocked private or internal URL', status: 400 });
    expect(request).not.toHaveBeenCalled();
  });

  it('follows a redirect and reports the final URL as the source', async () => {
    const finalResponse = new Response('<html></html>', { status: 200 });
    const request = jest
      .fn()
      .mockResolvedValueOnce(redirectTo('/moved'))
      .mockResolvedValueOnce(finalResponse);

    const result = await fetchSafeUrl(SOURCE_URL, signal, {
      resolveAddress: jest.fn().mockResolvedValue(address),
      request,
    });

    expect(result.response).toBe(finalResponse);
    expect(result.sourceUrl.toString()).toBe('https://example.com/moved');
  });

  it('revalidates the address of every redirect hop', async () => {
    const resolveAddress = jest.fn().mockResolvedValue(address);
    const request = jest
      .fn()
      .mockResolvedValueOnce(redirectTo('https://redirected.example/step'))
      .mockResolvedValueOnce(new Response('<html></html>', { status: 200 }));

    await fetchSafeUrl(SOURCE_URL, signal, { resolveAddress, request });

    expect(resolveAddress.mock.calls.map(([url]: [URL]) => url.toString())).toEqual([
      'https://example.com/articles/hello',
      'https://redirected.example/step',
    ]);
  });

  it('blocks a redirect that points at an internal address', async () => {
    const resolveAddress = jest.fn().mockResolvedValueOnce(address).mockResolvedValueOnce(null);
    const request = jest.fn().mockResolvedValue(redirectTo('http://127.0.0.1/admin'));

    await expect(
      fetchSafeUrl(SOURCE_URL, signal, { resolveAddress, request })
    ).rejects.toMatchObject({ message: 'Blocked private or internal URL', status: 400 });
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('rejects a redirect without a location header', async () => {
    await expect(
      fetchSafeUrl(SOURCE_URL, signal, {
        resolveAddress: jest.fn().mockResolvedValue(address),
        request: jest.fn().mockResolvedValue(new Response(null, { status: 302 })),
      })
    ).rejects.toMatchObject({ message: 'Failed to fetch target URL', status: 502 });
  });

  it('stops after the maximum number of redirects', async () => {
    const request = jest.fn().mockResolvedValue(redirectTo('/loop'));

    await expect(
      fetchSafeUrl(SOURCE_URL, signal, {
        resolveAddress: jest.fn().mockResolvedValue(address),
        request,
      })
    ).rejects.toMatchObject({ message: 'Too many redirects', status: 400 });
    expect(request).toHaveBeenCalledTimes(MAX_REDIRECTS + 1);
  });

  it('reports a LinkPreviewError instance so the route can map the status', async () => {
    await expect(
      fetchSafeUrl(SOURCE_URL, signal, {
        resolveAddress: jest.fn().mockResolvedValue(null),
        request: jest.fn(),
      })
    ).rejects.toBeInstanceOf(LinkPreviewError);
  });
});
