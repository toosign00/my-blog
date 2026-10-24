import { Fragment } from 'react';
import { LinkEmbed } from '@/components/ui/linkEmbed';
import { ICON_SIZE } from '@/design-system/tokens/icon';
import { getEmploymentPeriodLabels } from '@/utils/employment-period-util';
import { EmploymentPeriod } from './EmploymentPeriod';

interface TimelineItemBase {
  title: string;
  href?: string;
  tags: readonly string[];
  description: readonly {
    title?: string;
    items: readonly string[];
  }[];
  embed?: string;
}

interface PeriodTimelineItem extends TimelineItemBase {
  period: string;
}

interface EmploymentTimelineItem extends TimelineItemBase {
  startMonth: string;
  endMonth: string | null;
}

type TimelineItem = PeriodTimelineItem | EmploymentTimelineItem;

interface TimelineSectionProps {
  heading: string;
  items: readonly TimelineItem[];
}

const TimelinePeriod = ({ item }: { item: TimelineItem }) =>
  'startMonth' in item ? (
    <EmploymentPeriod
      startMonth={item.startMonth}
      endMonth={item.endMonth}
      initialLabels={getEmploymentPeriodLabels(item.startMonth, item.endMonth)}
    />
  ) : (
    <span className='text-tertiary font-mono text-label'>{item.period}</span>
  );

const ExternalLinkIcon = () => (
  <svg
    aria-hidden='true'
    className='inline-block shrink-0 align-baseline'
    width={ICON_SIZE.xs}
    height={ICON_SIZE.xs}
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
      <h3 className='section-heading'>{heading}</h3>
      <ul className='column gap-8'>
        {items.map((item) => (
          <li
            key={`${item.title}-${'startMonth' in item ? item.startMonth : item.period}`}
            className='flex flex-col gap-2'
          >
            <div className='flex flex-col tablet:flex-row tablet:justify-between gap-1 tablet:gap-4 items-start tablet:items-center'>
              {item.href ? (
                <a
                  href={item.href}
                  target='_blank'
                  rel='noreferrer'
                  className='hover-fade inline text-heading font-bold text-secondary border-b border-fill'
                >
                  {item.title} <ExternalLinkIcon />
                </a>
              ) : (
                <span className='text-heading font-bold text-secondary'>{item.title}</span>
              )}
              <div className='hidden tablet:block'>
                <TimelinePeriod item={item} />
              </div>
            </div>

            <div className='flex items-center gap-2 text-label text-tertiary font-medium flex-wrap'>
              {item.tags.map((tag, i) => (
                <Fragment key={tag}>
                  {i > 0 && <span className='w-px h-3 bg-pressed' />}
                  <span>{tag}</span>
                </Fragment>
              ))}
              <span aria-hidden='true' className='w-px h-3 bg-pressed tablet:hidden' />
              <div className='font-normal tablet:hidden'>
                <TimelinePeriod item={item} />
              </div>
            </div>

            <div className='column gap-4 leading-relaxed'>
              {item.description.map((group) => (
                <div className='column gap-1' key={group.title ?? group.items[0]}>
                  {group.title && (
                    <h4 className='font-semibold text-heading text-secondary leading-tight tracking-tight'>
                      {group.title}
                    </h4>
                  )}
                  {group.items.map((line) => (
                    <p className='text-tertiary' key={line}>
                      {line}
                    </p>
                  ))}
                </div>
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
