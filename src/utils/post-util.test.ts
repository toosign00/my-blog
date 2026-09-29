/** @jest-environment node */
import type { PostMetadata } from '@/types/post.types';
import {
  getAllPosts,
  getPostBySlug,
  getPostPageDataBySlug,
  getPostSlugs,
  getPostToc,
  PostNotFoundError,
} from './post-util';

const mockAccess = jest.fn();
const mockRead = jest.fn();
const mockReaddir = jest.fn();
const mockSharp = jest.fn();
const mockContent = () => null;
let mockMetadata: PostMetadata | undefined;
jest.mock('node:fs/promises', () => ({
  access: (...args: unknown[]) => mockAccess(...args),
  readFile: (...args: unknown[]) => mockRead(...args),
  readdir: (...args: unknown[]) => mockReaddir(...args),
}));
jest.mock('sharp', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockSharp(...args),
}));
jest.mock(
  `${process.cwd()}/src/app/posts/_articles/filmlog-01/post.mdx`,
  () => ({
    __esModule: true,
    default: mockContent,
    get metadata() {
      return mockMetadata;
    },
  }),
  { virtual: true }
);
jest.mock(
  `${process.cwd()}/src/app/posts/_articles/my-first-qa-engineer-job/post.mdx`,
  () => ({
    __esModule: true,
    default: mockContent,
    get metadata() {
      return { ...mockMetadata, createdAt: '2025-01-01' };
    },
  }),
  { virtual: true }
);

const valid: PostMetadata = {
  title: 'Test post',
  subtitle: 'Subtitle',
  createdAt: '2026-01-01',
  modifiedAt: '2026-09-25',
  coverImage: 'cover.png',
  category: 'Testing',
};
const directory = (name: string, isDirectory = true) => ({ name, isDirectory: () => isDirectory });

beforeEach(() => {
  mockMetadata = { ...valid };
  mockAccess.mockReset().mockResolvedValue(undefined);
  mockRead.mockReset().mockResolvedValue(Buffer.from('image'));
  mockReaddir.mockReset().mockResolvedValue([directory('filmlog-01')]);
  const pipeline = {
    resize: jest.fn(),
    blur: jest.fn(),
    toBuffer: jest.fn().mockResolvedValue({
      data: Buffer.from('blur'),
      info: { format: 'png' },
    }),
  };
  pipeline.resize.mockReturnValue(pipeline);
  pipeline.blur.mockReturnValue(pipeline);
  mockSharp.mockReset().mockReturnValue(pipeline);
});

it('loads metadata and exposes the content module without rendering it', async () => {
  const data = await getPostPageDataBySlug('filmlog-01');
  expect(data.content).toBe(mockContent);
  expect(data.post).toEqual({
    ...valid,
    _id: 'filmlog-01',
    slug: 'filmlog-01',
    coverImage: '/covers/posts/filmlog-01/cover.png',
    coverImageBlur: 'data:image/png;base64,Ymx1cg==',
  });
  await expect(getPostBySlug('filmlog-01')).resolves.toEqual(data.post);
});

it('preserves remote covers and optional tags', async () => {
  mockMetadata = { ...valid, coverImage: 'https://example.com/cover.png', tags: ['Testing'] };
  await expect(getPostBySlug('filmlog-01')).resolves.toMatchObject({
    coverImage: 'https://example.com/cover.png',
    tags: ['Testing'],
  });
});

it('still loads a post when thumbnail generation fails', async () => {
  mockSharp.mockImplementation(() => {
    throw new Error('invalid image');
  });
  await expect(getPostBySlug('filmlog-01')).resolves.toMatchObject({
    title: valid.title,
    coverImageBlur: undefined,
  });
});

it('reports a missing post with a specific error', async () => {
  mockAccess.mockRejectedValue(new Error('ENOENT'));
  await expect(getPostBySlug('missing')).rejects.toBeInstanceOf(PostNotFoundError);
  await expect(getPostBySlug('missing')).rejects.toThrow('Post not found: missing');
});

it('rejects modules without metadata in detail and list loading', async () => {
  mockMetadata = undefined;
  await expect(getPostBySlug('filmlog-01')).rejects.toThrow(
    'Missing `metadata` in filmlog-01/post.mdx'
  );
  await expect(getAllPosts()).rejects.toThrow('Missing `metadata` in filmlog-01/post.mdx');
});

it.each(['title', 'subtitle', 'createdAt', 'modifiedAt', 'coverImage', 'category'] as const)(
  'rejects a missing %s',
  async (key) => {
    mockMetadata = { ...valid, [key]: '' };
    await expect(getPostBySlug('filmlog-01')).rejects.toThrow(`${key} is required`);
  }
);

it.each([
  ['createdAt', 'invalid', 'createdAt must be a valid date'],
  ['modifiedAt', 'invalid', 'modifiedAt must be a valid date'],
  ['tags', [''], 'tags must be a string array'],
  ['coverImage', 'https://', 'coverImage must be a valid URL or local file name'],
])('rejects invalid %s metadata', async (key, value, message) => {
  mockMetadata = { ...valid, [key as string]: value };
  await expect(getPostBySlug('filmlog-01')).rejects.toThrow(message as string);
});

it('lists only directories as slugs', async () => {
  mockReaddir.mockResolvedValue([directory('filmlog-01'), directory('README.md', false)]);
  await expect(getPostSlugs()).resolves.toEqual(['filmlog-01']);
});

it.each([
  ['my-first-qa-engineer-job', 'filmlog-01'],
  ['filmlog-01', 'my-first-qa-engineer-job'],
])('sorts posts newest first from %s then %s', async (first, second) => {
  mockReaddir.mockResolvedValue([
    directory(first),
    directory('README.md', false),
    directory(second),
  ]);
  expect((await getAllPosts()).map((post) => post.slug)).toEqual([
    'filmlog-01',
    'my-first-qa-engineer-job',
  ]);
});

it('extracts level two and three headings with normalized IDs', async () => {
  mockRead.mockResolvedValue('# Title\n## Hello, World!\nText\n### 한글 제목\n#### Ignored\n');
  await expect(getPostToc('filmlog-01')).resolves.toEqual([
    { id: 'hello-world', text: 'Hello, World!', level: 2 },
    { id: '한글-제목', text: '한글 제목', level: 3 },
  ]);
});

it('returns an empty table of contents without matching headings', async () => {
  mockRead.mockResolvedValue('Plain text');
  await expect(getPostToc('filmlog-01')).resolves.toEqual([]);
});
