'use client';

import '@/styles/index.css';
import { Button, buttonClass } from '@/components/ui/Button';
import { GeistMono } from '@/styles/tokens/fonts';

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// next-themes is not mounted here, so apply its stored theme (storageKey 'theme', class attribute) before paint.
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${GeistMono.variable} center min-h-dvh`}>
        <section className='column-center gap-4 py-12'>
          <p className='text-display-sm font-semibold text-primary tablet:text-display'>Error</p>
          <h1 className='text-body font-medium text-secondary'>문제가 발생했어요</h1>
          <p className='text-caption font-medium text-center text-tertiary'>
            잠시 후 다시 시도하거나 홈으로 이동해 주세요.
          </p>

          <div className='flex gap-2 pt-2'>
            <Button className='min-w-20 text-secondary' onClick={reset}>
              Retry
            </Button>
            <a className={buttonClass({ className: 'min-w-20 text-secondary' })} href='/'>
              Home
            </a>
          </div>
        </section>
        <span aria-hidden className='sr-only'>
          {error.digest}
        </span>
      </body>
    </html>
  );
}
