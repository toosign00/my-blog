import { NextResponse } from 'next/server';
import { fetchRecentGitHubActivities } from '@/utils/github-activity-util';

export const revalidate = 3600;

export async function GET() {
  if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 503 });
  }

  try {
    const activities = await fetchRecentGitHubActivities();
    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
