import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toc } from './toc';

let notify: IntersectionObserverCallback;
const observe = jest.fn();
const disconnect = jest.fn();
const originalObserver = global.IntersectionObserver;

beforeEach(() => {
  global.IntersectionObserver = jest.fn((callback) => {
    notify = callback;
    return { observe, disconnect };
  }) as unknown as typeof IntersectionObserver;
});
afterEach(() => {
  global.IntersectionObserver = originalObserver;
});

const items = [
  { id: 'intro', text: 'Introduction', level: 2 as const },
  { id: 'details', text: 'Details', level: 3 as const },
];

it('does not create a navigation or observer without headings', () => {
  render(<Toc items={[]} />);
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  expect(global.IntersectionObserver).not.toHaveBeenCalled();
});

it('tracks visible headings and disconnects on unmount', () => {
  const { unmount } = render(
    <>
      <h2 id='intro'>Intro body</h2>
      <h3 id='details'>Detail body</h3>
      <Toc items={items} />
    </>
  );
  expect(observe).toHaveBeenCalledTimes(2);
  act(() =>
    notify(
      [
        { isIntersecting: false, target: screen.getByRole('heading', { name: 'Intro body' }) },
        { isIntersecting: true, target: screen.getByRole('heading', { name: 'Detail body' }) },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver
    )
  );
  // The active heading is currently indicated visually through font weight.
  expect(screen.getByRole('link', { name: 'Details' })).toHaveClass('font-medium');
  expect(screen.getByRole('link', { name: 'Introduction' })).not.toHaveClass('font-medium');
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(1);
});

it('scrolls to the heading with an offset and tolerates absent headings', async () => {
  const scroll = jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  const user = userEvent.setup();
  render(
    <>
      <h2 id='intro'>Intro body</h2>
      <Toc items={items} />
    </>
  );
  jest
    .spyOn(screen.getByRole('heading'), 'getBoundingClientRect')
    .mockReturnValue({ top: 100 } as DOMRect);
  expect(observe).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole('link', { name: 'Introduction' }));
  expect(scroll).toHaveBeenCalledWith({ top: 90, behavior: 'smooth' });
  await user.click(screen.getByRole('link', { name: 'Details' }));
  expect(scroll).toHaveBeenCalledTimes(1);
});
