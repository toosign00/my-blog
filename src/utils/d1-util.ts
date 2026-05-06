interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  errors: { message: string }[];
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

  const data = (await res.json()) as D1Result<T>;

  if (!data.success) {
    throw new Error(`D1 query error: ${data.errors.map((e) => e.message).join(', ')}`);
  }

  return data.results;
}
