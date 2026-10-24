import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ImageProps } from 'next/image';
import { LinkEmbed } from './linkEmbed';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, src, onError }: ImageProps) => (
    // biome-ignore lint/performance/noImgElement: Native image events exercise the Next.js image boundary.
    <img alt={alt} src={src as string} onError={onError} />
  ),
}));

const url = 'https://example.com/article?lang=ko';
const metadata = {
  title: 'Article title',
  description: 'Article description',
  image: 'https://example.com/cover.png',
  favicon: 'https://example.com/favicon.ico',
};
const originalFetch = global.fetch;
const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

afterEach(() => {
  global.fetch = originalFetch;
});

const response = (data: object, ok = true) => ({ ok, json: async () => data }) as Response;

const expectExternalLink = () => {
  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', url);
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
};

it.each(['card', 'mention'] as const)(
  'renders manual %s metadata without requesting the API',
  (variant) => {
    render(
      <LinkEmbed
        url={url}
        variant={variant}
        title={metadata.title}
        favicon={metadata.favicon}
        description={variant === 'card' ? metadata.description : undefined}
        thumbnail={variant === 'card' ? metadata.image : undefined}
      />
    );

    expect(screen.getByText(metadata.title)).toBeInTheDocument();
    expectExternalLink();
    expect(fetchMock).not.toHaveBeenCalled();
    if (variant === 'card') {
      expect(screen.getByText(metadata.description)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: metadata.title })).toHaveAttribute(
        'src',
        metadata.image
      );
    }
  }
);

it.each(['card', 'mention'] as const)(
  'waits for metadata before displaying the %s link',
  async (variant) => {
    let resolve!: (value: Response) => void;
    fetchMock.mockReturnValue(
      new Promise<Response>((done) => {
        resolve = done;
      })
    );
    render(<LinkEmbed url={url} variant={variant} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText(metadata.title)).not.toBeInTheDocument();
    await act(async () => {
      resolve(response(metadata));
    });

    expect(screen.getByText(metadata.title)).toBeInTheDocument();
    expectExternalLink();
    expect(fetchMock).toHaveBeenCalledWith(`/api/link-preview?url=${encodeURIComponent(url)}`);
    expect(screen.getByRole('presentation')).toHaveAttribute('src', metadata.favicon);
    if (variant === 'card') {
      expect(screen.getByText(metadata.description)).toBeInTheDocument();
      expect(screen.getByText('example.com')).toBeInTheDocument();
      expect(screen.getByRole('img', { name: metadata.title })).toHaveAttribute(
        'src',
        metadata.image
      );
    }
  }
);

it('uses defaults when the API returns no optional metadata', async () => {
  fetchMock.mockResolvedValue(response({}));
  render(<LinkEmbed url={url} />);

  expect(await screen.findByRole('heading', { name: url })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: url })).toHaveAttribute('src', '/og-image.png');
  expect(screen.getByRole('presentation')).toHaveAttribute(
    'src',
    'https://www.google.com/s2/favicons?domain=example.com&sz=128'
  );
  expect(screen.queryByText(metadata.description)).not.toBeInTheDocument();
  expectExternalLink();
});

it('keeps partial manual metadata while filling missing fields from the API', async () => {
  fetchMock.mockResolvedValue(response(metadata));
  render(<LinkEmbed url={url} title='Manual title' description='Manual description' />);

  expect(await screen.findByRole('heading', { name: 'Manual title' })).toBeInTheDocument();
  expect(screen.getByText('Manual description')).toBeInTheDocument();
  expect(screen.queryByText(metadata.description)).not.toBeInTheDocument();
  expect(screen.getByRole('img', { name: 'Manual title' })).toHaveAttribute('src', metadata.image);
});

it.each([
  ['HTTP failure', () => Promise.resolve(response({}, false)), undefined],
  ['network failure', () => Promise.reject(new Error('Network unavailable')), 'Manual title'],
  ['non-Error rejection', () => Promise.reject('Network unavailable'), undefined],
])('falls back to a plain link after %s', async (_reason, request, title) => {
  fetchMock.mockImplementation(request);
  render(<LinkEmbed url={url} title={title} />);

  expect(await screen.findByRole('link')).toHaveTextContent(title ?? url);
  expectExternalLink();
  expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it.each(['card', 'mention'] as const)('replaces a broken %s favicon with an icon', (variant) => {
  render(
    <LinkEmbed
      url={url}
      variant={variant}
      title={metadata.title}
      description={metadata.description}
      thumbnail={metadata.image}
      favicon={metadata.favicon}
    />
  );

  fireEvent.error(screen.getByRole('presentation'));

  expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  expect(screen.getByTitle('Favicon Error')).toBeInTheDocument();
  expect(screen.getByText(metadata.title)).toBeInTheDocument();
  expectExternalLink();
});

it('hides a broken thumbnail while retaining the card content', () => {
  render(
    <LinkEmbed
      url={url}
      title={metadata.title}
      description={metadata.description}
      thumbnail={metadata.image}
    />
  );

  fireEvent.error(screen.getByRole('img', { name: metadata.title }));

  expect(screen.queryByRole('img', { name: metadata.title })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: metadata.title })).toBeInTheDocument();
  expect(screen.getByText(metadata.description)).toBeInTheDocument();
  expectExternalLink();
});
