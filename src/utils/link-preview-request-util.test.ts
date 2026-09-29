/** @jest-environment node */
import { EventEmitter } from 'node:events';
import type { IncomingMessage, RequestOptions } from 'node:http';
import { Readable } from 'node:stream';
import { createPinnedRequestOptions, requestPinnedUrl } from './link-preview-request-util';

const mockHttp = jest.fn();
const mockHttps = jest.fn();
jest.mock('node:http', () => ({ request: (...args: unknown[]) => mockHttp(...args) }));
jest.mock('node:https', () => ({ request: (...args: unknown[]) => mockHttps(...args) }));

beforeEach(() => {
  mockHttp.mockReset();
  mockHttps.mockReset();
});

it.each([
  ['https://example.com:8443/article?q=1', '203.0.113.10', 4, '8443'],
  ['http://example.com/article?q=1', '2001:db8::1', 6, undefined],
] as const)(
  'pins %s to the supplied address while preserving the host',
  (src, address, family, port) => {
    const signal = new AbortController().signal;
    const options = createPinnedRequestOptions(new URL(src), { address, family }, signal);
    expect(options).toMatchObject({
      hostname: address,
      family,
      port,
      path: '/article?q=1',
      method: 'GET',
      signal,
    });
    expect(options.headers).toMatchObject({ Host: new URL(src).host });
    if (src.startsWith('https:')) expect(options.servername).toBe('example.com');
    else expect(options).not.toHaveProperty('servername');
  }
);

const incoming = (statusCode: number | undefined, text = 'response body') =>
  Object.assign(Readable.from([Buffer.from(text)]), {
    statusCode,
    headers: { 'content-type': 'text/html', 'set-cookie': ['a=1', 'b=2'], missing: undefined },
  }) as unknown as IncomingMessage;

const serve = (transport: jest.Mock, stream: IncomingMessage) => {
  const outgoing = Object.assign(new EventEmitter(), { end: jest.fn() });
  outgoing.end.mockImplementation(() => transport.mock.calls[0][1](stream));
  transport.mockReturnValue(outgoing);
};

it.each(['http:', 'https:'])(
  'streams a %s response with its status and headers',
  async (protocol) => {
    serve(protocol === 'https:' ? mockHttps : mockHttp, incoming(200));
    const result = await requestPinnedUrl(
      new URL(`${protocol}//example.com`),
      { address: '203.0.113.10', family: 4 },
      new AbortController().signal
    );
    expect(result.status).toBe(200);
    expect(await result.text()).toBe('response body');
    expect(result.headers.get('content-type')).toBe('text/html');
    expect(result.headers.getSetCookie()).toEqual(['a=1', 'b=2']);
    expect(result.headers.has('missing')).toBe(false);
  }
);

it.each([204, 205, 304])('returns no response body for status %s', async (status) => {
  serve(mockHttps, incoming(status));
  const result = await requestPinnedUrl(
    new URL('https://example.com'),
    { address: '203.0.113.10', family: 4 },
    new AbortController().signal
  );
  expect(result.status).toBe(status);
  expect(result.body).toBeNull();
});

it('defaults a missing status to 500', async () => {
  serve(mockHttps, incoming(undefined));
  const result = await requestPinnedUrl(
    new URL('https://example.com'),
    { address: '203.0.113.10', family: 4 },
    new AbortController().signal
  );
  expect(result.status).toBe(500);
  expect(await result.text()).toBe('response body');
});

it('rejects transport errors', async () => {
  const outgoing = Object.assign(new EventEmitter(), { end: jest.fn() });
  outgoing.end.mockImplementation(() => outgoing.emit('error', new Error('connection failed')));
  mockHttps.mockReturnValue(outgoing);
  await expect(
    requestPinnedUrl(
      new URL('https://example.com'),
      { address: '203.0.113.10', family: 4 },
      new AbortController().signal
    )
  ).rejects.toThrow('connection failed');
});

it('passes cancellation to the transport and rejects its abort error', async () => {
  const controller = new AbortController();
  const outgoing = Object.assign(new EventEmitter(), { end: jest.fn() });
  mockHttps.mockImplementation((options: RequestOptions) => {
    options.signal?.addEventListener('abort', () => outgoing.emit('error', new Error('aborted')));
    return outgoing;
  });
  const pending = requestPinnedUrl(
    new URL('https://example.com'),
    { address: '203.0.113.10', family: 4 },
    controller.signal
  );
  const assertion = expect(pending).rejects.toThrow('aborted');
  controller.abort();
  await assertion;
});
