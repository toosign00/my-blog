import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { AfterMount } from '.';

it('renders the fallback during server rendering', () => {
  const html = renderToString(
    <AfterMount fallback={<span>불러오는 중</span>}>
      <span>마운트 완료</span>
    </AfterMount>
  );

  expect(html).toContain('불러오는 중');
  expect(html).not.toContain('마운트 완료');
});

it('renders nothing on the server without a fallback', () => {
  const html = renderToString(
    <AfterMount>
      <span>마운트 완료</span>
    </AfterMount>
  );

  expect(html).toBe('');
});

it('renders children after mounting in the browser', () => {
  render(
    <AfterMount fallback={<span>불러오는 중</span>}>
      <span>마운트 완료</span>
    </AfterMount>
  );

  expect(screen.getByText('마운트 완료')).toBeInTheDocument();
  expect(screen.queryByText('불러오는 중')).not.toBeInTheDocument();
});
