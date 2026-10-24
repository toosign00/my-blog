import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { PostViews } from './postViews';
import { PostViewsProvider } from './postViewsProvider';

const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>();

const jsonResponse = (body: unknown) =>
  ({
    json: async () => body,
    ok: true,
  }) as Response;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { gcTime: Infinity, retry: false },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const renderPostViews = () =>
  render(
    <PostViewsProvider slugs={['first', 'second']}>
      <PostViews slug='first' />
      <PostViews slug='second' />
    </PostViewsProvider>,
    { wrapper: createWrapper() }
  );

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

it('shows placeholders while post views are loading', () => {
  fetchMock.mockImplementation(() => new Promise(() => undefined));

  renderPostViews();

  expect(screen.getAllByText('- views')).toHaveLength(2);
});

it('shows the corresponding view count for each post', async () => {
  fetchMock.mockResolvedValue(
    jsonResponse({
      '/posts/first': { today: 0, total: 1234 },
      '/posts/second': { today: 0, total: 56 },
    })
  );

  renderPostViews();

  expect(await screen.findByText('1,234 views')).toBeInTheDocument();
  expect(await screen.findByText('56 views')).toBeInTheDocument();
});
