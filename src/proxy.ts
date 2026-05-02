import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const proxy = (request: NextRequest) => {
  const rewritten = request.nextUrl.pathname.replace("/covers", "/api/covers");
  return NextResponse.rewrite(new URL(rewritten, request.url));
};

export const config = {
  matcher: "/covers/:path*",
};
