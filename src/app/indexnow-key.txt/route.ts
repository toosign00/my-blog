export const dynamic = 'force-dynamic';

export const GET = async (): Promise<Response> => {
  const key = process.env.INDEXNOW_KEY;

  if (!key) {
    return new Response('Not Found', { status: 404 });
  }

  return new Response(key, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
