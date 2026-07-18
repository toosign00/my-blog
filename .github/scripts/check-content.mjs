import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const rootDir = process.cwd();
const contentGroups = [
  {
    name: 'posts',
    dir: path.join(rootDir, 'src', 'app', 'posts', '_articles'),
    file: 'post.mdx',
    requiredFields: ['title', 'subtitle', 'createdAt', 'modifiedAt', 'coverImage', 'category'],
    dateFields: ['createdAt', 'modifiedAt'],
    urlFields: [],
    requiredImages: ['coverImage'],
    optionalImages: [],
  },
  {
    name: 'projects',
    dir: path.join(rootDir, 'src', 'app', 'projects', '_projects'),
    file: 'project.mdx',
    requiredFields: ['title', 'description', 'createdAt', 'modifiedAt', 'coverImage', 'tags'],
    dateFields: ['createdAt', 'modifiedAt', 'projectDue'],
    urlFields: ['repository', 'docs', 'url'],
    requiredImages: ['coverImage'],
    optionalImages: ['heroImage'],
  },
];

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const metadataStringValueRegex = (key) => new RegExp(`${key}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`, 'm');
const metadataFieldRegex = (key) => new RegExp(`${key}\\s*:`, 'm');

const isRemoteImage = (value) => /^https?:\/\//.test(value);

const isValidDateString = (value) => Number.isFinite(Date.parse(value));

const isValidHttpsUrl = (value) => {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

const exists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const readMetadataImage = (content, key) => {
  const match = content.match(metadataStringValueRegex(key));
  return match?.[1];
};

const readMetadataString = (content, key) => {
  const match = content.match(metadataStringValueRegex(key));
  return match?.[1];
};

const hasMetadataField = (content, key) => metadataFieldRegex(key).test(content);

const checkSlug = ({ slug, metadataFile, errors }) => {
  if (!slugRegex.test(slug)) {
    errors.push(
      `${path.relative(rootDir, metadataFile)}: slug "${slug}" must use lowercase kebab-case`
    );
  }
};

const checkRequiredFields = ({ content, metadataFile, requiredFields, errors }) => {
  for (const key of requiredFields) {
    if (!hasMetadataField(content, key)) {
      errors.push(`${path.relative(rootDir, metadataFile)}: metadata.${key} is required`);
    }
  }
};

const checkDateFields = ({ content, metadataFile, dateFields, errors }) => {
  for (const key of dateFields) {
    const value = readMetadataString(content, key);
    if (value !== undefined && !isValidDateString(value)) {
      errors.push(`${path.relative(rootDir, metadataFile)}: metadata.${key} must be a valid date`);
    }
  }
};

const checkUrlFields = ({ content, metadataFile, urlFields, errors }) => {
  for (const key of urlFields) {
    const value = readMetadataString(content, key);
    if (value !== undefined && !isValidHttpsUrl(value)) {
      errors.push(`${path.relative(rootDir, metadataFile)}: metadata.${key} must be an https URL`);
    }
  }
};

const checkImage = async ({ content, slug, itemDir, metadataFile, key, required, errors }) => {
  const image = readMetadataImage(content, key);

  if (!image) {
    if (required) {
      errors.push(`${path.relative(rootDir, metadataFile)}: metadata.${key} is required`);
    }
    return;
  }

  if (isRemoteImage(image)) {
    return;
  }

  const imagePath = path.join(itemDir, image.replace(/^\.\//, ''));
  if (!(await exists(imagePath))) {
    errors.push(
      `${path.relative(rootDir, metadataFile)}: metadata.${key} points to missing file "${image}" for ${slug}`
    );
  }
};

const checkGroup = async ({
  name,
  dir,
  file,
  requiredFields,
  dateFields,
  urlFields,
  requiredImages,
  optionalImages,
}) => {
  const errors = [];

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const slug = entry.name;
    const itemDir = path.join(dir, slug);
    const metadataFile = path.join(itemDir, file);

    if (!(await exists(metadataFile))) {
      continue;
    }

    const content = await readFile(metadataFile, 'utf8');

    checkSlug({ slug, metadataFile, errors });
    checkRequiredFields({ content, metadataFile, requiredFields, errors });
    checkDateFields({ content, metadataFile, dateFields, errors });
    checkUrlFields({ content, metadataFile, urlFields, errors });

    for (const key of requiredImages) {
      await checkImage({ content, slug, itemDir, metadataFile, key, required: true, errors });
    }

    for (const key of optionalImages) {
      await checkImage({ content, slug, itemDir, metadataFile, key, required: false, errors });
    }
  }

  return { name, errors };
};

const results = await Promise.all(contentGroups.map(checkGroup));
const errors = results.flatMap((result) => result.errors);

if (errors.length > 0) {
  console.error('Content check failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Content check passed.');
