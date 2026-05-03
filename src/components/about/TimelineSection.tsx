import { Fragment } from 'react';
import { LinkEmbed } from '@/components/ui/linkEmbed';

interface TimelineItem {
  title: string;
  href?: string;
  period: string;
  tags: readonly string[];
  description: readonly string[];
  embed?: string;
}

interface TimelineSectionProps {
  heading: string;
  items: readonly TimelineItem[];
}

const ExternalLinkIcon = () => (
  <svg
    aria-hidden='true'
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='3'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M7 7h10v10' />
    <path d='M7 17 17 7' />
  </svg>
);

export const TimelineSection = ({ heading, items }: TimelineSectionProps) => {
  return (
    <section className='column gap-6'>
      <h3 className='h3 text-gray-light'>{heading}</h3>
      <ul className='column gap-8'>
        {items.map((item) => (
          <li key={item.title} className='flex flex-col gap-2'>
            <div className='flex flex-col tablet:flex-row tablet:justify-between gap-1 tablet:gap-4 items-start tablet:items-center'>
              {item.href ? (
                <a
                  href={item.href}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center gap-1 text-lg font-bold text-gray-bold border-b border-background06 hover:opacity-70 transition-opacity duration-150'
                >
                  {item.title}
                  <ExternalLinkIcon />
                </a>
              ) : (
                <span className='text-lg font-bold text-gray-bold'>{item.title}</span>
              )}
              <span className='text-gray-mid font-mono text-sm'>{item.period}</span>
            </div>

            <div className='flex items-center gap-2 text-gray-accent font-medium flex-wrap'>
              {item.tags.map((tag, i) => (
                <Fragment key={tag}>
                  {i > 0 && <span className='w-px h-3 bg-border' />}
                  <span>{tag}</span>
                </Fragment>
              ))}
            </div>

            <div className='column gap-1 text-gray-mid leading-relaxed'>
              {item.description.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            {item.embed && (
              <div className='mt-2'>
                <LinkEmbed url={item.embed} variant='mention' />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
