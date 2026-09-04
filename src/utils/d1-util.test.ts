import { queryD1 } from './d1-util';

const ORIGINAL_ENV = process.env;

const jsonResponse = (body: unknown): Response =>
  ({ ok: true, status: 200, json: async () => body }) as Response;

beforeEach(() => {
  process.env = {
    ...ORIGINAL_ENV,
    CLOUDFLARE_ACCOUNT_ID: 'account',
    CLOUDFLARE_D1_DATABASE_ID: 'database',
    CLOUDFLARE_API_TOKEN: 'token',
  };
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
});

describe('queryD1', () => {
  it('returns the rows of the first statement result', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        jsonResponse({ success: true, result: [{ success: true, results: [{ total: 7 }] }] })
      );

    await expect(queryD1('SELECT total FROM page_view_counts')).resolves.toEqual([{ total: 7 }]);
  });

  it('sends the SQL and the parameters to the D1 query endpoint', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue(jsonResponse({ success: true, result: [{ success: true, results: [] }] }));
    global.fetch = fetchMock;

    await queryD1('SELECT 1 WHERE pathname = ?', ['/posts/hello']);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'https://api.cloudflare.com/client/v4/accounts/account/d1/database/database/query'
    );
    expect(JSON.parse(init.body)).toEqual({
      sql: 'SELECT 1 WHERE pathname = ?',
      params: ['/posts/hello'],
    });
  });

  it.each(['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_D1_DATABASE_ID', 'CLOUDFLARE_API_TOKEN'])(
    'rejects without calling the API when %s is missing',
    async (variable) => {
      const fetchMock = jest.fn();
      global.fetch = fetchMock;
      delete process.env[variable];

      await expect(queryD1('SELECT 1')).rejects.toThrow(
        'Missing Cloudflare D1 environment variables'
      );
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it('rejects with the HTTP status when the request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 } as Response);

    await expect(queryD1('SELECT 1')).rejects.toThrow('D1 request failed: 503');
  });

  it('rejects with the joined API errors when the response is unsuccessful', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      jsonResponse({
        success: false,
        errors: [{ message: 'bad token' }, { message: 'quota exceeded' }],
      })
    );

    await expect(queryD1('SELECT 1')).rejects.toThrow('D1 query error: bad token, quota exceeded');
  });

  it('rejects with an unknown error when the failed response lists no errors', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse({ success: false }));

    await expect(queryD1('SELECT 1')).rejects.toThrow('D1 query error: unknown error');
  });

  it('returns an empty list when the response carries no statement result', async () => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse({ success: true, result: [] }));

    await expect(queryD1('SELECT 1')).resolves.toEqual([]);
  });

  it('rejects when the statement itself failed', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      jsonResponse({
        success: true,
        result: [{ success: false, results: [], errors: [{ message: 'no such table' }] }],
      })
    );

    await expect(queryD1('SELECT 1')).rejects.toThrow('D1 query error: no such table');
  });

  it('rejects with an unknown error when the failed statement lists no errors', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(
        jsonResponse({ success: true, result: [{ success: false, results: [] }] })
      );

    await expect(queryD1('SELECT 1')).rejects.toThrow('D1 query error: unknown error');
  });

  it('returns an empty list when the successful statement carries no rows', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue(jsonResponse({ success: true, result: [{ success: true }] }));

    await expect(queryD1('SELECT 1')).resolves.toEqual([]);
  });
});
