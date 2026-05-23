import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PATHS } from '@/constants/paths.constants';
import { resolveSafeCoverPath } from '@/utils/api-validation-util';

const MIME_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
};

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) => {
  const { path: segments } = await params;
  const filePath = resolveSafeCoverPath(PATHS.POSTS_ARTICLES_DIR, segments);

  if (!filePath) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  let file: Buffer;

  try {
    file = await readFile(filePath);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'Content-Type': MIME_TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
