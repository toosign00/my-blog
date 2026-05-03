'use client';

import Link from 'next/link';
import { ROUTES } from '@/constants/menu.constants';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <section className='column-center min-h-[calc(100dvh-14rem)] py-12'>
      <div className='column-center gap-4 px-6 py-8 tablet:px-10 tablet:py-10'>
        <h1 className='h3 text-gray-bold'>문제가 발생했어요</h1>
        <p className='h4 text-center text-gray-mid'>잠시 후 다시 시도해 주세요.</p>

        <div className='center gap-2 pt-2'>
          <button
            className='ui-button h4 min-w-20 px-2 text-gray-bold'
            onClick={reset}
            type='button'
          >
            Retry
          </button>
          <Link className='ui-button h4 min-w-20 px-2 text-gray-bold' href={ROUTES.HOME}>
            Home
          </Link>
        </div>
      </div>
      <span aria-hidden className='sr-only'>
        {error.digest}
      </span>
    </section>
  );
};

export default ErrorPage;
