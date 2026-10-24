'use client';

import Link from 'next/link';
import { Button, buttonClass } from '@/components/ui/Button';
import { ROUTES } from '@/constants/menu.constants';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  return (
    <section className='column-center min-h-status-page py-12'>
      <div className='column-center gap-4 px-6 py-8 tablet:px-10 tablet:py-10'>
        <h1 className='text-body font-semibold leading-none tracking-tight text-secondary'>
          문제가 발생했어요
        </h1>
        <p className='text-caption font-medium text-center text-tertiary'>
          잠시 후 다시 시도해 주세요.
        </p>

        <div className='center gap-2 pt-2'>
          <Button className='min-w-20 text-secondary' onClick={reset}>
            Retry
          </Button>
          <Link
            className={buttonClass({ className: 'min-w-20 text-secondary' })}
            href={ROUTES.HOME}
          >
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
