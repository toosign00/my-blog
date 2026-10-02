/** @jest-environment node */
import { queryD1, queryD1Batch } from './d1-util';

beforeEach(() => {
  jest.replaceProperty(process, 'env', {
    ...process.env,
    CLOUDFLARE_ACCOUNT_ID: 'test-account',
    CLOUDFLARE_D1_DATABASE_ID: 'test-database',
    CLOUDFLARE_API_TOKEN: 'test-token',
  });
});

it('returns query rows and sends bound parameters to the configured database', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(
    Response.json({
      success: true,
      result: [{ success: true, results: [{ total: 12 }] }],
    })
  );
  await expect(queryD1('SELECT total WHERE pathname = ?', ['/posts/test'])).resolves.toEqual([
    { total: 12 },
  ]);
  expect(fetch).toHaveBeenCalledWith(
    'https://api.cloudflare.com/client/v4/accounts/test-account/d1/database/test-database/query',
    expect.objectContaining({
      method: 'POST',
      cache: 'no-store',
      headers: { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: 'SELECT total WHERE pathname = ?', params: ['/posts/test'] }),
    })
  );
});

it.each(['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_D1_DATABASE_ID', 'CLOUDFLARE_API_TOKEN'])(
  'rejects missing %s before making a request',
  async (key) => {
    delete process.env[key];
    const fetch = jest.spyOn(global, 'fetch');
    await expect(queryD1('SELECT 1')).rejects.toThrow(
      'Missing Cloudflare D1 environment variables'
    );
    expect(fetch).not.toHaveBeenCalled();
  }
);

it.each([
  { success: true },
  { success: true, result: [] },
  { success: true, result: [{ success: true }] },
])('returns an empty list for an empty successful response %j', async (data) => {
  const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(Response.json(data));
  await expect(queryD1('SELECT 1')).resolves.toEqual([]);
  expect(fetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      body: JSON.stringify({ sql: 'SELECT 1', params: [] }),
    })
  );
});

it.each([
  [{ success: false, errors: [{ message: 'denied' }, { message: 'invalid' }] }, 'denied, invalid'],
  [{ success: false }, 'unknown error'],
  [{ success: true, result: [{ success: false, errors: [{ message: 'bad SQL' }] }] }, 'bad SQL'],
  [{ success: true, result: [{ success: false }] }, 'unknown error'],
])('reports API query errors %j', async (data, message) => {
  jest.spyOn(global, 'fetch').mockResolvedValue(Response.json(data));
  await expect(queryD1('SELECT 1')).rejects.toThrow(`D1 query error: ${message}`);
});

it('reports unsuccessful HTTP responses', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 503 }));
  await expect(queryD1('SELECT 1')).rejects.toThrow('D1 request failed: 503');
});

it('propagates transport failures', async () => {
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('offline'));
  await expect(queryD1('SELECT 1')).rejects.toThrow('offline');
});

it('sends statements as one batch and returns the rows of each in order', async () => {
  const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(
    Response.json({
      success: true,
      result: [
        { success: true, results: [] },
        { success: true, results: [{ total: 3 }] },
      ],
    })
  );
  await expect(
    queryD1Batch([{ sql: 'DELETE FROM t' }, { sql: 'SELECT total WHERE id = ?', params: [1] }])
  ).resolves.toEqual([[], [{ total: 3 }]]);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetch.mock.calls[0][1]?.body as string)).toEqual({
    batch: [
      { sql: 'DELETE FROM t', params: [] },
      { sql: 'SELECT total WHERE id = ?', params: [1] },
    ],
  });
});

it('reports a failed statement in a batch', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(
    Response.json({
      success: true,
      result: [
        { success: true, results: [] },
        { success: false, errors: [{ message: 'bad' }] },
      ],
    })
  );
  await expect(queryD1Batch([{ sql: 'SELECT 1' }, { sql: 'SELECT x' }])).rejects.toThrow(
    'D1 query error: bad'
  );
});
