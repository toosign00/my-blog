import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { type PropsWithChildren, StrictMode } from 'react';
import { ViewCounter } from './view-counter';

const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>();

const jsonResponse = (body: unknown) =>
  ({
    json: async () => body,
    ok: true,
  }) as Response;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { gcTime: Infinity, retry: false },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockViewsApi = (total: number) => {
  fetchMock.mockImplementation((_input, init) => {
    if (init?.method === 'POST') {
      return Promise.resolve(
        jsonResponse({
          counted: true,
          ok: true,
          page: { today: 0, total },
          site: { today: 1, total: 1 },
        })
      );
    }
    return Promise.reject(new Error('Unexpected GET'));
  });
};

beforeEach(() => {
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: fetchMock,
    writable: true,
  });
});

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'fetch');
});

describe('ViewCounter', () => {
  it('shows a placeholder while the count is loading', () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));

    render(<ViewCounter pathname='/posts/hello' />, { wrapper: createWrapper() });

    expect(screen.getByText('- views')).toBeInTheDocument();
  });

  it('shows the total view count with thousands separators', async () => {
    mockViewsApi(12345);

    render(<ViewCounter pathname='/posts/hello' />, { wrapper: createWrapper() });

    expect(await screen.findByText('12,345 views')).toBeInTheDocument();
  });

  it('records the visit for the given pathname', async () => {
    mockViewsApi(1);

    render(<ViewCounter pathname='/posts/hello' />, { wrapper: createWrapper() });

    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(
          ([, init]) => init?.method === 'POST' && init.body === '{"pathname":"/posts/hello"}'
        )
      ).toBe(true)
    );
  });

  it('records the visit only once even when the effect runs twice', async () => {
    mockViewsApi(1);

    render(
      <StrictMode>
        <ViewCounter pathname='/posts/hello' />
      </StrictMode>,
      { wrapper: createWrapper() }
    );

    await screen.findByText('1 views');
    expect(fetchMock.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(1);
  });
  it('shows the count from the visit response without a follow-up request', async () => {
    mockViewsApi(7);

    render(<ViewCounter pathname='/posts/hello' />, { wrapper: createWrapper() });

    expect(await screen.findByText('7 views')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('loads the count separately when recording the visit fails', async () => {
    fetchMock.mockImplementation((_input, init) =>
      Promise.resolve(
        init?.method === 'POST' ? ({ ok: false } as Response) : jsonResponse({ today: 0, total: 7 })
      )
    );

    render(<ViewCounter pathname='/posts/hello' />, { wrapper: createWrapper() });

    expect(await screen.findByText('7 views')).toBeInTheDocument();
    expect(fetchMock.mock.calls.map(([, init]) => init?.method ?? 'GET')).toEqual(['POST', 'GET']);
  });
});
