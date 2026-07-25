import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { useBatchViewsQuery, useViewsMutation, useViewsQuery } from './useViews';

const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>();

const jsonResponse = (body: unknown, ok = true) =>
  ({
    json: async () => body,
    ok,
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

it('loads views for an encoded pathname', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ today: 2, total: 10 }));
  const { result } = renderHook(() => useViewsQuery('/posts/hello world'), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toEqual({ today: 2, total: 10 });
  expect(fetchMock).toHaveBeenCalledWith('/api/views?pathname=%2Fposts%2Fhello%20world', {
    cache: 'no-cache',
  });
});

it('loads site-wide views when no pathname is provided', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ today: 3, total: 20 }));
  const { result } = renderHook(() => useViewsQuery(), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toEqual({ today: 3, total: 20 });
  expect(fetchMock).toHaveBeenCalledWith('/api/views?scope=all', { cache: 'no-cache' });
});

it('exposes initial views before the refetch completes', () => {
  fetchMock.mockImplementation(() => new Promise(() => undefined));
  const { result } = renderHook(() => useViewsQuery('/posts/initial', { today: 1, total: 2 }), {
    wrapper: createWrapper(),
  });

  expect(result.current.data).toEqual({ today: 1, total: 2 });
});

it('exposes an error when a views request fails', async () => {
  fetchMock.mockResolvedValue(jsonResponse({}, false));
  const { result } = renderHook(() => useViewsQuery('/posts/error'), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isError).toBe(true));

  expect(result.current.error).toEqual(new Error('Failed to load views'));
});

it('loads views for every requested post pathname', async () => {
  const views = {
    '/posts/first': { today: 0, total: 12 },
    '/posts/second': { today: 0, total: 34 },
  };
  fetchMock.mockResolvedValue(jsonResponse(views));
  const { result } = renderHook(() => useBatchViewsQuery(['/posts/first', '/posts/second']), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data).toEqual(views);
  expect(fetchMock).toHaveBeenCalledWith(
    '/api/views?pathnames=%2Fposts%2Ffirst%2C%2Fposts%2Fsecond',
    { cache: 'no-cache' }
  );
});

it('exposes an error when a batch views request fails', async () => {
  fetchMock.mockResolvedValue(jsonResponse({}, false));
  const { result } = renderHook(() => useBatchViewsQuery(['/posts/error']), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isError).toBe(true));

  expect(result.current.error).toEqual(new Error('Failed to load views'));
});

it('keeps the batch query idle when no pathname is provided', () => {
  const { result } = renderHook(() => useBatchViewsQuery([]), {
    wrapper: createWrapper(),
  });

  expect(result.current.fetchStatus).toBe('idle');
  expect(fetchMock).not.toHaveBeenCalled();
});

it('records a view for the requested pathname', async () => {
  fetchMock.mockResolvedValue(jsonResponse({ counted: true, ok: true }));
  const { result } = renderHook(() => useViewsMutation('/'), {
    wrapper: createWrapper(),
  });

  await act(async () => {
    await expect(result.current.mutateAsync()).resolves.toEqual({
      counted: true,
      ok: true,
    });
  });

  expect(fetchMock).toHaveBeenCalledWith('/api/views', {
    body: JSON.stringify({ pathname: '/' }),
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
});

it('exposes an error when recording a view fails', async () => {
  fetchMock.mockResolvedValue(jsonResponse({}, false));
  const { result } = renderHook(() => useViewsMutation('/'), {
    wrapper: createWrapper(),
  });

  await act(async () => {
    await expect(result.current.mutateAsync()).rejects.toThrow('Failed to record view');
  });
});
