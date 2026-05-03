import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import sharp from 'sharp';

export interface BlurOptions {
  width?: number;
  height?: number;
  blur?: number;
}

const BLUR_STRENGTH = 5;

const isUrl = (value: string): boolean => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const isSystemPath = (imagePath: string): boolean => {
  if (!path.isAbsolute(imagePath)) {
    return false;
  }
  return imagePath.startsWith(process.cwd());
};

const loadBuffer = async (imagePath: string): Promise<Buffer> => {
  if (isUrl(imagePath)) {
    const response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  let fullPath: string;

  if (isSystemPath(imagePath)) {
    fullPath = imagePath;
  } else if (imagePath.startsWith('/')) {
    const publicPath = path.join(process.cwd(), 'public', imagePath);
    const srcAssetPath = path.join(process.cwd(), 'src', imagePath.slice(1));
    fullPath = existsSync(publicPath) ? publicPath : srcAssetPath;
  } else {
    fullPath = imagePath;
  }

  return await readFile(fullPath);
};

export const createBlur = cache(
  async (imagePath: string, options: BlurOptions = {}): Promise<string> => {
    const { width = 20, height = 20, blur = BLUR_STRENGTH } = options;

    try {
      const buffer = await loadBuffer(imagePath);
      const { data, info } = await sharp(buffer)
        .resize(width, height, { fit: 'inside' })
        .blur(blur)
        .toBuffer({ resolveWithObject: true });

      return `data:image/${info.format};base64,${data.toString('base64')}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`createBlur failed: ${errorMessage}`);
    }
  }
);
