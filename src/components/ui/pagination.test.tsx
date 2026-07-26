import { render, screen, within } from '@testing-library/react';
import { Pagination } from './pagination';

describe('Pagination', () => {
  it('shows the first five pages and only the next control on the first page', () => {
    render(<Pagination basePath='/posts' currentPage={1} totalPages={10} />);

    const navigation = screen.getByRole('navigation', {
      name: 'Pagination navigation',
    });
    expect(within(navigation).getByText('1')).toHaveAttribute('aria-current', 'page');
    expect(within(navigation).getByRole('link', { name: 'Go to page 5' })).toHaveAttribute(
      'href',
      '/posts/p/5'
    );
    expect(within(navigation).queryByRole('link', { name: 'Go to previous page' })).toBeNull();
    expect(within(navigation).getByRole('link', { name: 'Go to next page' })).toHaveAttribute(
      'href',
      '/posts/p/2'
    );
  });

  it('shows a centered page range with previous and next controls', () => {
    render(<Pagination basePath='/posts' currentPage={5} totalPages={10} />);

    const navigation = screen.getByRole('navigation', {
      name: 'Pagination navigation',
    });
    expect(within(navigation).getByRole('link', { name: 'Go to page 3' })).toBeInTheDocument();
    expect(within(navigation).getByText('5')).toHaveAttribute('aria-current', 'page');
    expect(within(navigation).getByRole('link', { name: 'Go to page 7' })).toBeInTheDocument();
    expect(within(navigation).getByRole('link', { name: 'Go to previous page' })).toHaveAttribute(
      'href',
      '/posts/p/4'
    );
    expect(within(navigation).getByRole('link', { name: 'Go to next page' })).toHaveAttribute(
      'href',
      '/posts/p/6'
    );
  });

  it('shows the last five pages and only the previous control on the last page', () => {
    render(<Pagination basePath='/posts' currentPage={10} totalPages={10} />);

    const navigation = screen.getByRole('navigation', {
      name: 'Pagination navigation',
    });
    expect(within(navigation).getByRole('link', { name: 'Go to page 6' })).toBeInTheDocument();
    expect(within(navigation).getByText('10')).toHaveAttribute('aria-current', 'page');
    expect(within(navigation).getByRole('link', { name: 'Go to previous page' })).toHaveAttribute(
      'href',
      '/posts/p/9'
    );
    expect(within(navigation).queryByRole('link', { name: 'Go to next page' })).toBeNull();
  });

  it('removes a trailing slash and links page one to the base path', () => {
    render(<Pagination basePath='/categories/testing/' currentPage={2} totalPages={3} />);

    expect(screen.getByRole('link', { name: 'Go to page 1' })).toHaveAttribute(
      'href',
      '/categories/testing'
    );
    expect(screen.getByRole('link', { name: 'Go to page 3' })).toHaveAttribute(
      'href',
      '/categories/testing/p/3'
    );
  });
});
