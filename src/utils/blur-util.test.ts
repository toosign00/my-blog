/** @jest-environment node */
import path from 'node:path';
import { createBlur } from './blur-util';

const mockRead = jest.fn();
const mockExists = jest.fn();
const mockSharp = jest.fn();
jest.mock('node:fs/promises', () => ({ readFile: (...args: unknown[]) => mockRead(...args) }));
jest.mock('node:fs', () => ({ existsSync: (...args: unknown[]) => mockExists(...args) }));
jest.mock('sharp', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockSharp(...args),
}));

const pipeline = { resize: jest.fn(), blur: jest.fn(), toBuffer: jest.fn() };
beforeEach(() => {
  mockRead.mockReset().mockResolvedValue(Buffer.from('source'));
  mockExists.mockReset().mockReturnValue(true);
  mockSharp.mockReset().mockReturnValue(pipeline);
  pipeline.resize.mockReset().mockReturnValue(pipeline);
  pipeline.blur.mockReset().mockReturnValue(pipeline);
  pipeline.toBuffer
    .mockReset()
    .mockResolvedValue({ data: Buffer.from('blur'), info: { format: 'png' } });
});

it.each([
  ['relative.png', 'relative.png'],
  [path.join(process.cwd(), 'source.png'), path.join(process.cwd(), 'source.png')],
  ['/cover.png', path.join(process.cwd(), 'public', 'cover.png')],
])('loads %s and returns an encoded thumbnail', async (src, expectedPath) => {
  await expect(createBlur(src)).resolves.toBe('data:image/png;base64,Ymx1cg==');
  expect(mockRead).toHaveBeenCalledWith(expectedPath);
  expect(mockSharp).toHaveBeenCalledWith(Buffer.from('source'));
  expect(pipeline.resize).toHaveBeenCalledWith(20, 20, { fit: 'inside' });
  expect(pipeline.blur).toHaveBeenCalledWith(5);
});

it('falls back from public to src assets', async () => {
  mockExists.mockReturnValue(false);
  await expect(createBlur('/assets/cover.png')).resolves.toBe('data:image/png;base64,Ymx1cg==');
  expect(mockRead).toHaveBeenCalledWith(path.join(process.cwd(), 'src/assets/cover.png'));
});

it('fetches remote images and applies custom dimensions and blur', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(new Response('remote source'));
  await expect(
    createBlur('https://example.com/cover.png', { width: 8, height: 12, blur: 2 })
  ).resolves.toBe('data:image/png;base64,Ymx1cg==');
  expect(fetch).toHaveBeenCalledWith('https://example.com/cover.png');
  expect(mockSharp).toHaveBeenCalledWith(Buffer.from('remote source'));
  expect(pipeline.resize).toHaveBeenCalledWith(8, 12, { fit: 'inside' });
  expect(pipeline.blur).toHaveBeenCalledWith(2);
  expect(mockRead).not.toHaveBeenCalled();
});

it('reports HTTP failures with context', async () => {
  jest
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response(null, { status: 404, statusText: 'Not Found' }));
  await expect(createBlur('https://example.com/missing')).rejects.toThrow(
    'createBlur failed: Failed to fetch image: 404 Not Found'
  );
});

it.each([
  [new Error('unreadable'), 'unreadable'],
  ['failure', 'Unknown error'],
])('wraps file loading failures %s', async (error, message) => {
  mockRead.mockRejectedValue(error);
  await expect(createBlur('missing.png')).rejects.toThrow(`createBlur failed: ${message}`);
});

it('reports image decoding failures', async () => {
  mockSharp.mockImplementation(() => {
    throw new Error('unsupported image');
  });
  await expect(createBlur('broken.png')).rejects.toThrow('createBlur failed: unsupported image');
});
