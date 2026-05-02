import fs from "node:fs";
import path from "node:path";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
};

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) => {
  const { path: segments } = await params;
  const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "posts",
    "_articles",
    ...segments,
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const file = fs.readFileSync(filePath);

  return new NextResponse(file, {
    headers: {
      "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
