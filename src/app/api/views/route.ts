import { type NextRequest, NextResponse } from 'next/server';
import { getPostsViews } from '@/utils/stats-util';

export async function GET(request: NextRequest) {
  try {
    const slugs = request.nextUrl.searchParams.get('slugs');
    if (!slugs) return NextResponse.json({});
    const views = await getPostsViews(slugs.split(','));
    return NextResponse.json(views);
  } catch {
    return NextResponse.json({});
  }
}
