import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import type { TocItem } from '@/types/post.types';
import { Toc } from './toc';

type ObserverCallback = (entries: { isIntersecting: boolean; target: { id: string } }[]) => void;

let notify: ObserverCallback;
let observed: Element[];
let disconnect: jest.Mock;

const items: TocItem[] = [
  { id: 'intro', text: 'Introduction', level: 2 },
  { id: 'details', text: 'Details', level: 3 },
];

const renderHeadings = () => {
  document.body.innerHTML = `<h2 id="intro">Introduction</h2><h3 id="details">Details</h3>`;
};

beforeEach(() => {
  observed = [];
  disconnect = jest.fn();
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    value: class {
      constructor(callback: ObserverCallback) {
        notify = callback;
      }
      observe(element: Element) {
        observed.push(element);
      }
      disconnect = disconnect;
    },
    writable: true,
  });
});

afterEach(() => {
  Reflect.deleteProperty(globalThis, 'IntersectionObserver');
  document.body.innerHTML = '';
});

describe('Toc', () => {
  it('renders a link for every heading', () => {
    render(<Toc items={items} />);

    expect(screen.getByRole('link', { name: 'Introduction' })).toHaveAttribute('href', '#intro');
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute('href', '#details');
  });

  it('renders nothing when there is no heading', () => {
    const { container } = render(<Toc items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('observes only the headings that exist in the document', () => {
    renderHeadings();
    render(<Toc items={[...items, { id: 'missing', text: 'Missing', level: 2 }]} />);

    expect(observed.map((element) => element.id)).toEqual(['intro', 'details']);
  });

  it('highlights the heading that scrolls into view', () => {
    renderHeadings();
    render(<Toc items={items} />);

    act(() => {
      notify([{ isIntersecting: true, target: { id: 'details' } }]);
    });

    expect(screen.getByRole('link', { name: 'Details' })).toHaveClass('text-gray-accent');
    expect(screen.getByRole('link', { name: 'Introduction' })).toHaveClass('text-gray-light');
  });

  it('highlights the first intersecting heading of a batch', () => {
    renderHeadings();
    render(<Toc items={items} />);

    act(() => {
      notify([
        { isIntersecting: false, target: { id: 'details' } },
        { isIntersecting: true, target: { id: 'intro' } },
      ]);
    });

    expect(screen.getByRole('link', { name: 'Introduction' })).toHaveClass('text-gray-accent');
  });

  it('scrolls to the heading instead of jumping when a link is clicked', async () => {
    const user = userEvent.setup();
    renderHeadings();
    const scrollTo = jest.fn();
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: scrollTo });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 100 });
    render(<Toc items={items} />);

    await user.click(screen.getByRole('link', { name: 'Details' }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 90, behavior: 'smooth' });
  });

  it('ignores a click when the heading is no longer in the document', async () => {
    const user = userEvent.setup();
    const scrollTo = jest.fn();
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: scrollTo });
    render(<Toc items={items} />);

    await user.click(screen.getByRole('link', { name: 'Details' }));

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('stops observing when it unmounts', () => {
    renderHeadings();
    const { unmount } = render(<Toc items={items} />);

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
