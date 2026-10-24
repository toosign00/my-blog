import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { twMerge } from '@/utils/tw-merge-util';

const toHeadingId = (children: ReactNode): string => {
  const text = typeof children === 'string' ? children : '';
  return text
    .toLowerCase()
    .replace(/[^\w\sㄱ-힣]/g, '')
    .replace(/\s+/g, '-');
};

export const H1 = (props: ComponentProps<'h1'>) => (
  <h1 className='mb-6 text-balance font-semibold text-primary text-heading-lg' {...props} />
);

export const H2 = ({ children, ...props }: ComponentProps<'h2'>) => (
  <h2
    id={toHeadingId(children)}
    className='mt-12 mb-6 text-balance font-semibold text-primary text-heading leading-tight tracking-tight'
    {...props}
  >
    {children}
  </h2>
);

export const H3 = ({ children, ...props }: ComponentProps<'h3'>) => (
  <h3
    id={toHeadingId(children)}
    className='mt-12 mb-6 text-balance font-semibold text-primary leading-tight tracking-tight'
    {...props}
  >
    {children}
  </h3>
);

export const H4 = (props: ComponentProps<'h4'>) => (
  <h4
    className='mt-12 mb-6 text-balance font-semibold text-primary text-body leading-snug'
    {...props}
  />
);

export const UL = (props: ComponentProps<'ul'>) => (
  <ul className='mt-6 flex list-outside list-disc flex-col gap-2 pl-5' {...props} />
);

export const OL = (props: ComponentProps<'ol'>) => (
  <ol className='mt-6 flex list-outside list-decimal flex-col gap-2 pl-5' {...props} />
);

export const LI = (props: ComponentProps<'li'>) => (
  <li
    className='pl-1 font-normal text-body-lg leading-relaxed [&_ol]:mt-2 [&_ul]:mt-2'
    {...props}
  />
);

type AnchorProps = Omit<ComponentProps<'a'>, 'href'> & { href?: string };

export const A = ({ href, ...props }: AnchorProps) => (
  <Link
    className={twMerge(
      'break-keep underline decoration-from-font underline-offset-3 transition-colors duration-fast',
      'text-secondary outline-offset-2 hover:text-primary'
    )}
    draggable={false}
    href={href ?? ''}
    {...(href?.startsWith('https://')
      ? {
          target: '_blank',
          rel: 'noopener noreferrer',
        }
      : {})}
    {...props}
  />
);

export const Strong = (props: ComponentProps<'strong'>) => (
  <strong className='font-medium' {...props} />
);

export const P = (props: ComponentProps<'p'>) => (
  <p className='mt-6 font-normal text-primary text-body leading-loose' {...props} />
);

export const Blockquote = (props: ComponentProps<'blockquote'>) => (
  <blockquote
    className='column quote-rule -ml-6 rounded-md border border-default bg-fill-weak p-4 pl-6'
    {...props}
  />
);

export const HR = (props: ComponentProps<'hr'>) => (
  <hr className='mx-auto my-12 w-24 border-default' {...props} />
);
