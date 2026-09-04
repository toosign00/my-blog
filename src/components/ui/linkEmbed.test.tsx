import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LinkEmbed } from './linkEmbed';

const fetchMock = jest.fn<ReturnType<typeof fetch>, Parameters<typeof fetch>>();

const url = 'https://example.com/articles/hello';

const jsonResponse = (body: unknown) =>
  ({
    json: async () => body,
    ok: true,
  }) as Response;

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

describe('LinkEmbed card', () => {
  it('renders the manual metadata without calling the preview API', () => {
    render(
      <LinkEmbed
        description='Manual description'
        thumbnail='https://example.com/cover.png'
        title='Manual title'
        url={url}
      />
    );

    expect(screen.getByRole('heading', { name: 'Manual title' })).toBeInTheDocument();
    expect(screen.getByText('Manual description')).toBeInTheDocument();
    expect(screen.getByText('example.com')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('opens the link in a new tab without leaking the opener', () => {
    render(
      <LinkEmbed
        description='Manual description'
        thumbnail='https://example.com/cover.png'
        title='Manual title'
        url={url}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows no link while the metadata is loading', () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));

    render(<LinkEmbed url={url} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('requests the preview API with the encoded target URL', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ title: 'Fetched title' }));

    render(<LinkEmbed url={url} />);

    await screen.findByRole('heading', { name: 'Fetched title' });
    expect(fetchMock).toHaveBeenCalledWith(`/api/link-preview?url=${encodeURIComponent(url)}`);
  });

  it('shows the fetched title, description and image', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        title: 'Fetched title',
        description: 'Fetched description',
        image: 'https://example.com/fetched.png',
      })
    );

    render(<LinkEmbed url={url} />);

    expect(await screen.findByRole('heading', { name: 'Fetched title' })).toBeInTheDocument();
    expect(screen.getByText('Fetched description')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Fetched title' })).toHaveAttribute(
      'src',
      'https://example.com/fetched.png'
    );
  });

  it('shows the URL as the title when the preview carries none', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));

    render(<LinkEmbed url={url} />);

    expect(await screen.findByRole('heading', { name: url })).toBeInTheDocument();
  });

  it('falls back to a plain link when the preview API fails', async () => {
    fetchMock.mockResolvedValue({ ok: false } as Response);

    render(<LinkEmbed url={url} />);

    const link = await screen.findByRole('link', { name: `🔗 ${url}` });
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('falls back to a plain link when the request throws', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));

    render(<LinkEmbed url={url} />);

    expect(await screen.findByRole('link', { name: `🔗 ${url}` })).toBeInTheDocument();
  });

  it('falls back to a plain link when the request rejects with a non-error value', async () => {
    fetchMock.mockRejectedValue('offline');

    render(<LinkEmbed url={url} />);

    expect(await screen.findByRole('link', { name: `🔗 ${url}` })).toBeInTheDocument();
  });

  it('shows the manual title in the fallback link when one was given', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));

    render(<LinkEmbed title='Manual title' url={url} />);

    expect(await screen.findByRole('link', { name: '🔗 Manual title' })).toBeInTheDocument();
  });

  it('hides the thumbnail when the image fails to load', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ title: 'Fetched title' }));
    render(<LinkEmbed url={url} />);

    const thumbnail = await screen.findByRole('img', { name: 'Fetched title' });
    fireEvent.error(thumbnail);

    await waitFor(() =>
      expect(screen.queryByRole('img', { name: 'Fetched title' })).not.toBeInTheDocument()
    );
  });

  it('shows a placeholder icon when the favicon fails to load', async () => {
    render(
      <LinkEmbed
        description='Manual description'
        thumbnail='https://example.com/cover.png'
        title='Manual title'
        url={url}
      />
    );

    fireEvent.error(screen.getByRole('presentation'));

    expect(await screen.findByTitle('Favicon Error')).toBeInTheDocument();
  });
});

describe('LinkEmbed mention', () => {
  it('renders the manual metadata without calling the preview API', () => {
    render(
      <LinkEmbed
        favicon='https://example.com/icon.png'
        title='Manual title'
        url={url}
        variant='mention'
      />
    );

    expect(screen.getByRole('link', { name: 'Manual title' })).toHaveAttribute('href', url);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fetches the metadata when only the title was given', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ title: 'Fetched title' }));

    render(<LinkEmbed title='Manual title' url={url} variant='mention' />);

    expect(await screen.findByRole('link', { name: 'Manual title' })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalled();
  });

  it('shows no link while the metadata is loading', () => {
    fetchMock.mockImplementation(() => new Promise(() => undefined));

    render(<LinkEmbed url={url} variant='mention' />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('shows a placeholder icon when the favicon fails to load', async () => {
    render(
      <LinkEmbed
        favicon='https://example.com/icon.png'
        title='Manual title'
        url={url}
        variant='mention'
      />
    );

    fireEvent.error(screen.getByRole('presentation'));

    expect(await screen.findByTitle('Favicon Error')).toBeInTheDocument();
  });
});
