import { type NextRequest, NextResponse } from 'next/server';
import { queryD1 } from '@/utils/d1-util';

export async function GET(request: NextRequest) {
  try {
    const slugs = request.nextUrl.searchParams.getAll('slugs');
    if (slugs.length === 0) return NextResponse.json({});

    const pathnames = slugs.map((s) => `/posts/${s}`);
    const placeholders = pathnames.map(() => '?').join(', ');

    const rows = await queryD1<{ pathname: string; total: number }>(
      `SELECT pathname, COALESCE(SUM(count), 0) as total
       FROM page_views
       WHERE pathname IN (${placeholders})
       GROUP BY pathname`,
      pathnames
    );

    const result: Record<string, number> = {};
    for (const row of rows) {
      result[row.pathname] = row.total;
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
