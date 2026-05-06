interface D1BatchResult<T> {
  success: boolean;
  results: T[];
  errors?: { message: string }[];
}

interface D1ApiResponse<T> {
  success: boolean;
  errors?: { message: string }[];
  result?: D1BatchResult<T>[];
}

export async function queryD1<T = Record<string, unknown>>(
  sql: string,
  params: (string | number)[] = []
): Promise<T[]> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    throw new Error('Missing Cloudflare D1 environment variables');
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );

  if (!res.ok) {
    throw new Error(`D1 request failed: ${res.status}`);
  }

  const data = (await res.json()) as D1ApiResponse<T>;

  if (!data.success) {
    const msg = data.errors?.map((e) => e.message).join(', ') ?? 'unknown error';
    throw new Error(`D1 query error: ${msg}`);
  }

  const first = data.result?.[0];
  if (!first) {
    return [];
  }

  if (!first.success) {
    const msg = first.errors?.map((e) => e.message).join(', ') ?? 'unknown error';
    throw new Error(`D1 query error: ${msg}`);
  }

  return first.results ?? [];
}
