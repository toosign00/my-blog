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

export interface D1Statement {
  sql: string;
  params?: (string | number)[];
}

async function requestD1<T>(body: object): Promise<D1BatchResult<T>[]> {
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
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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

  return data.result ?? [];
}

function getRows<T>(result?: D1BatchResult<T>): T[] {
  if (!result) {
    return [];
  }

  if (!result.success) {
    const msg = result.errors?.map((e) => e.message).join(', ') ?? 'unknown error';
    throw new Error(`D1 query error: ${msg}`);
  }

  return result.results ?? [];
}

export async function queryD1<T = Record<string, unknown>>(
  sql: string,
  params: (string | number)[] = []
): Promise<T[]> {
  const [first] = await requestD1<T>({ sql, params });
  return getRows(first);
}

// Sends every statement in one request and returns the rows of each in order.
export async function queryD1Batch(
  statements: readonly D1Statement[]
): Promise<Record<string, unknown>[][]> {
  const results = await requestD1<Record<string, unknown>>({
    batch: statements.map(({ sql, params = [] }) => ({ sql, params })),
  });
  return statements.map((_, index) => getRows(results[index]));
}
