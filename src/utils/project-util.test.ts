/** @jest-environment node */
import type { ProjectMetadata } from '@/types/project.types';
import {
  getAllProjects,
  getProjectBySlug,
  getProjectPageDataBySlug,
  ProjectNotFoundError,
} from './project-util';

const mockAccess = jest.fn();
const mockRead = jest.fn();
const mockReaddir = jest.fn();
const mockSharp = jest.fn();
const mockContent = () => null;
let mockMetadata: ProjectMetadata | undefined;
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
  `${process.cwd()}/src/app/projects/_projects/community-runway/project.mdx`,
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
  `${process.cwd()}/src/app/projects/_projects/ops-dashboard/project.mdx`,
  () => ({
    __esModule: true,
    default: mockContent,
    get metadata() {
      return { ...mockMetadata, recommendedOrder: 1 };
    },
  }),
  { virtual: true }
);

const valid: ProjectMetadata = {
  title: 'Project',
  description: 'Description',
  createdAt: '2026-01-01',
  modifiedAt: '2026-09-25',
  coverImage: 'cover.png',
  tags: ['Testing'],
};
const directory = (name: string, isDirectory = true) => ({ name, isDirectory: () => isDirectory });

beforeEach(() => {
  mockMetadata = { ...valid };
  mockAccess.mockReset().mockResolvedValue(undefined);
  mockRead.mockReset().mockResolvedValue(Buffer.from('image'));
  mockReaddir.mockReset().mockResolvedValue([directory('community-runway')]);
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

it('loads the project and discovers a local hero image', async () => {
  const data = await getProjectPageDataBySlug('community-runway');
  expect(data.content).toBe(mockContent);
  expect(data.project).toEqual({
    ...valid,
    _id: 'community-runway',
    slug: 'community-runway',
    coverImage: '/covers/projects/community-runway/cover.png',
    heroImage: '/covers/projects/community-runway/hero.webp',
    coverImageBlur: 'data:image/png;base64,Ymx1cg==',
    heroImageBlur: 'data:image/png;base64,Ymx1cg==',
  });
  await expect(getProjectBySlug('community-runway')).resolves.toEqual(data.project);
});

it('uses the cover when no hero asset exists', async () => {
  mockAccess.mockImplementation(async (file: string) => {
    if (file.endsWith('hero.webp')) throw new Error('ENOENT');
  });
  await expect(getProjectBySlug('community-runway')).resolves.toMatchObject({
    heroImage: '/covers/projects/community-runway/cover.png',
    heroImageBlur: undefined,
  });
});

it('uses explicit remote images and valid optional metadata', async () => {
  mockMetadata = {
    ...valid,
    coverImage: 'https://example.com/cover.png',
    heroImage: 'https://example.com/hero.png',
    capabilities: ['Testing'],
    projectDue: '2026-09-25',
    recommendedOrder: 1,
    repository: 'https://example.com/repo',
    docs: 'https://example.com/docs',
    url: 'https://example.com',
  };
  jest.spyOn(global, 'fetch').mockImplementation(async () => new Response('remote'));
  await expect(getProjectBySlug('community-runway')).resolves.toMatchObject({
    ...mockMetadata,
    coverImageBlur: 'data:image/png;base64,Ymx1cg==',
    heroImageBlur: 'data:image/png;base64,Ymx1cg==',
  });
});

it('keeps image URLs when thumbnail generation fails', async () => {
  mockSharp.mockImplementation(() => {
    throw new Error('invalid image');
  });
  await expect(getProjectBySlug('community-runway')).resolves.toMatchObject({
    title: 'Project',
    coverImageBlur: undefined,
    heroImageBlur: undefined,
  });
});

it('reports a missing project', async () => {
  mockAccess.mockRejectedValue(new Error('ENOENT'));
  await expect(getProjectBySlug('missing')).rejects.toBeInstanceOf(ProjectNotFoundError);
  await expect(getProjectBySlug('missing')).rejects.toThrow('Project not found: missing');
});

it('rejects modules without metadata in detail and list loading', async () => {
  mockMetadata = undefined;
  await expect(getProjectBySlug('community-runway')).rejects.toThrow(
    'Missing `metadata` in community-runway/project.mdx'
  );
  await expect(getAllProjects()).rejects.toThrow(
    'Missing `metadata` in community-runway/project.mdx'
  );
});

it.each(['title', 'description', 'createdAt', 'modifiedAt', 'coverImage'] as const)(
  'rejects a missing %s',
  async (key) => {
    mockMetadata = { ...valid, [key]: '' };
    await expect(getProjectBySlug('community-runway')).rejects.toThrow(`${key} is required`);
  }
);

it.each([
  ['tags', [], 'tags must contain at least one value'],
  ['tags', [''], 'tags must contain at least one value'],
  ['capabilities', [''], 'capabilities must be a string array'],
  ['createdAt', 'invalid', 'createdAt must be a valid date'],
  ['modifiedAt', 'invalid', 'modifiedAt must be a valid date'],
  ['projectDue', 'invalid', 'projectDue must be a valid date'],
  ['recommendedOrder', Number.NaN, 'recommendedOrder must be a finite number'],
  ['coverImage', 'https://', 'coverImage must be a valid URL or local file name'],
  ['repository', '', 'repository must be a valid URL'],
  ['docs', 'invalid', 'docs must be a valid URL'],
  ['url', 'invalid', 'url must be a valid URL'],
])('rejects invalid %s', async (key, value, message) => {
  mockMetadata = { ...valid, [key as string]: value };
  await expect(getProjectBySlug('community-runway')).rejects.toThrow(message as string);
});

it('skips non-project entries and sorts recommended projects first', async () => {
  mockReaddir.mockResolvedValue([
    directory('community-runway'),
    directory('README.md', false),
    directory('missing'),
    directory('ops-dashboard'),
  ]);
  mockAccess.mockImplementation(async (file: string) => {
    if (file.includes('/missing/')) throw new Error('ENOENT');
  });
  expect((await getAllProjects()).map((project) => project.slug)).toEqual([
    'ops-dashboard',
    'community-runway',
  ]);
});
