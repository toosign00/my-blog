import Link from 'next/link';
import { ROUTES } from '@/constants/menu.constants';
import { buttonClass } from '@/design-system/components/Button';

const NotFoundPage = () => {
  return (
    <section className='column-center min-h-status-page py-12'>
      <div className='column-center gap-4 px-6 py-8 tablet:px-10 tablet:py-10'>
        <p className='text-display-sm font-semibold text-primary tablet:text-display'>404</p>
        <h1 className='text-body font-semibold leading-none tracking-tight text-secondary'>
          Page Not Found
        </h1>
        <p className='text-caption font-medium text-center text-tertiary'>
          요청한 주소가 없거나 이동되었을 수 있습니다.
        </p>

        <div className='center gap-2 pt-2'>
          <Link
            className={buttonClass({ className: 'min-w-20 text-secondary' })}
            href={ROUTES.HOME}
          >
            Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
