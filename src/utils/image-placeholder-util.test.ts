/** @jest-environment node */
import { getRemoteImagePlaceholder } from './image-placeholder-util';

const mockSharp = jest.fn();
jest.mock('sharp', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockSharp(...args),
}));
const pipeline = {
  metadata: jest.fn(),
  resize: jest.fn(),
  blur: jest.fn(),
  webp: jest.fn(),
  toBuffer: jest.fn(),
};
const src = 'https://files.toosign.me/cover.png';
const placeholder = { width: 1200, height: 800, blurDataURL: 'data:image/webp;base64,c21hbGw=' };
const cacheUrl = `https://api.cloudflare.com/client/v4/accounts/test/storage/kv/namespaces/test/values/${encodeURIComponent(`image-placeholder:v1:${src}`)}`;
let fetchMock: jest.SpiedFunction<typeof fetch>;

beforeEach(() => {
  jest.replaceProperty(process, 'env', {
    ...process.env,
    CLOUDFLARE_ACCOUNT_ID: 'test',
    CLOUDFLARE_IMAGE_PLACEHOLDERS_KV_NAMESPACE_ID: 'test',
    CLOUDFLARE_API_TOKEN: 'test',
  });
  mockSharp.mockReset().mockReturnValue(pipeline);
  pipeline.metadata.mockReset().mockResolvedValue({ width: 1200, height: 800 });
  for (const method of [pipeline.resize, pipeline.blur, pipeline.webp])
    method.mockReset().mockReturnValue(pipeline);
  pipeline.toBuffer.mockReset().mockResolvedValue(Buffer.from('small'));
  fetchMock = jest.spyOn(global, 'fetch').mockImplementation(async (_input, init) => {
    if (init?.method === 'PUT') return new Response(null, { status: 200 });
    if (_input instanceof URL) return new Response('source');
    return new Response(null, { status: 404 });
  });
});

it.each([
  '/local.png',
  'http://files.toosign.me/a.png',
  'https://other.example/a.png',
  'not a URL',
])('ignores unsupported source %s without fetching', async (input) => {
  await expect(getRemoteImagePlaceholder(input)).resolves.toBeNull();
  expect(fetchMock).not.toHaveBeenCalled();
});

it('uses a valid cached placeholder without downloading the source', async () => {
  fetchMock.mockResolvedValueOnce(Response.json(placeholder));
  await expect(getRemoteImagePlaceholder(src)).resolves.toEqual(placeholder);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(mockSharp).not.toHaveBeenCalled();
});

it('generates and stores a placeholder on a cache miss', async () => {
  await expect(getRemoteImagePlaceholder(src)).resolves.toEqual(placeholder);
  expect(mockSharp).toHaveBeenCalledWith(Buffer.from('source'));
  expect(pipeline.resize).toHaveBeenCalledWith(10, 10, { fit: 'inside' });
  expect(pipeline.webp).toHaveBeenCalledWith({ quality: 40 });
  const write = fetchMock.mock.calls.find(([, init]) => init?.method === 'PUT');
  expect(write?.[0]).toBe(cacheUrl);
  const form = write?.[1]?.body as FormData;
  expect(JSON.parse(form.get('value') as string)).toEqual(placeholder);
  expect(form.get('metadata')).toBe('{}');
});

it.each([
  null,
  'invalid',
  {},
  { width: 0 },
  { width: 10 },
  { width: 10, height: 0 },
  { width: 10, height: 20 },
  { width: 10, height: 20, blurDataURL: 'invalid' },
])('regenerates malformed cached data %j', async (value) => {
  fetchMock.mockResolvedValueOnce(Response.json(value));
  await expect(getRemoteImagePlaceholder(src)).resolves.toEqual(placeholder);
  expect(mockSharp).toHaveBeenCalled();
});

it.each([
  'CLOUDFLARE_ACCOUNT_ID',
  'CLOUDFLARE_IMAGE_PLACEHOLDERS_KV_NAMESPACE_ID',
  'CLOUDFLARE_API_TOKEN',
])('generates without cache when %s is missing', async (key) => {
  delete process.env[key];
  await expect(getRemoteImagePlaceholder(src)).resolves.toEqual(placeholder);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][0]).toEqual(new URL(src));
});

it('recovers from cache read failures', async () => {
  fetchMock.mockRejectedValueOnce(new Error('cache offline'));
  await expect(getRemoteImagePlaceholder(src)).resolves.toEqual(placeholder);
});

it('retains the generated placeholder when writing the cache fails', async () => {
  fetchMock
    .mockResolvedValueOnce(new Response(null, { status: 404 }))
    .mockResolvedValueOnce(new Response('source'))
    .mockRejectedValueOnce(new Error('write failed'));
  await expect(getRemoteImagePlaceholder(src)).resolves.toEqual(placeholder);
});

it('returns null when the source request fails', async () => {
  fetchMock.mockResolvedValue(new Response(null, { status: 503 }));
  await expect(getRemoteImagePlaceholder(src)).resolves.toBeNull();
});

it.each([{ height: 800 }, { width: 1200 }])(
  'returns null for missing image dimensions %j',
  async (metadata) => {
    pipeline.metadata.mockResolvedValue(metadata);
    await expect(getRemoteImagePlaceholder(src)).resolves.toBeNull();
    expect(fetchMock.mock.calls.some(([, init]) => init?.method === 'PUT')).toBe(false);
  }
);

it('returns null for image decoding failures', async () => {
  pipeline.metadata.mockRejectedValue(new Error('unsupported format'));
  await expect(getRemoteImagePlaceholder(src)).resolves.toBeNull();
});
