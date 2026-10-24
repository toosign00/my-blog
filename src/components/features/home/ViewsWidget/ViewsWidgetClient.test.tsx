import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { type PropsWithChildren, StrictMode } from 'react';
import { ViewsWidgetClient } from './ViewsWidgetClient';

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

const mockViewsApi = () => {
  fetchMock.mockImplementation((_input, init) => {
    if (init?.method === 'POST') {
      return Promise.resolve(
        jsonResponse({
          counted: true,
          ok: true,
          page: { today: 0, total: 9 },
          site: { today: 2, total: 5 },
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

it('shows placeholders while visit counts are loading', () => {
  fetchMock.mockImplementation(() => new Promise(() => undefined));

  render(<ViewsWidgetClient postCount={3} />, {
    wrapper: createWrapper(),
  });

  expect(screen.getAllByText('-')).toHaveLength(2);
});

it('shows visit and post counts from the home data', async () => {
  mockViewsApi();

  render(<ViewsWidgetClient postCount={3} />, {
    wrapper: createWrapper(),
  });

  expect(await screen.findByText('2')).toBeInTheDocument();
  expect(await screen.findByText('5')).toBeInTheDocument();
  expect(await screen.findByText('3')).toBeInTheDocument();
});

it('records the home visit only once in Strict Mode', async () => {
  mockViewsApi();
  render(
    <StrictMode>
      <ViewsWidgetClient postCount={3} />
    </StrictMode>,
    {
      wrapper: createWrapper(),
    }
  );

  await screen.findByText('5');

  await waitFor(() => {
    const postRequests = fetchMock.mock.calls.filter(([, init]) => init?.method === 'POST');
    expect(postRequests).toHaveLength(1);
  });
});

it('shows the counts from the visit response without a follow-up request', async () => {
  mockViewsApi();

  render(<ViewsWidgetClient postCount={3} />, {
    wrapper: createWrapper(),
  });

  expect(await screen.findByText('5')).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][1]?.method).toBe('POST');
});

it('loads visit counts separately when recording the visit fails', async () => {
  fetchMock.mockImplementation((_input, init) =>
    Promise.resolve(
      init?.method === 'POST' ? ({ ok: false } as Response) : jsonResponse({ today: 2, total: 5 })
    )
  );

  render(<ViewsWidgetClient postCount={3} />, {
    wrapper: createWrapper(),
  });

  expect(await screen.findByText('5')).toBeInTheDocument();
  expect(fetchMock.mock.calls.map(([, init]) => init?.method ?? 'GET')).toEqual(['POST', 'GET']);
});
