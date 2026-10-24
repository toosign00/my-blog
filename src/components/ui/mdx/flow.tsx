import { CircleAlert, Info, Lightbulb, type LucideIcon, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { twMerge } from '@/design-system/tw-merge';

interface StepsProps {
  children: ReactNode;
}

export const Steps = ({ children }: StepsProps) => (
  <ol className='steps-counter mt-6 flex flex-col gap-6 border-l border-default pl-6'>
    {children}
  </ol>
);

interface StepProps {
  title: ReactNode;
  children: ReactNode;
}

export const Step = ({ title, children }: StepProps) => (
  <li className='step-marker relative before:absolute before:-left-9 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:border before:border-default before:bg-canvas before:text-caption-sm before:font-medium before:text-tertiary'>
    <p className='mb-2 font-semibold text-primary'>{title}</p>
    <div className='text-body text-secondary leading-relaxed'>{children}</div>
  </li>
);

type AlertType = 'note' | 'tip' | 'warning' | 'destructive';

interface AlertProps {
  type?: AlertType;
  title?: string;
  children: ReactNode;
}

const ALERT_LABEL: Record<AlertType, string> = {
  note: 'Note',
  tip: 'Tip',
  warning: 'Warning',
  destructive: 'Destructive',
};

const ALERT_ICON = {
  note: Info,
  tip: Lightbulb,
  warning: TriangleAlert,
  destructive: CircleAlert,
} satisfies Record<AlertType, LucideIcon>;

const ALERT_TYPE_CLASS: Record<AlertType, string> = {
  note: '[&_svg]:text-tertiary',
  tip: '[&_svg]:text-tertiary',
  warning:
    'border-warning bg-warning text-warning [&_[data-alert-description]]:text-warning-muted [&_[data-alert-title]]:text-warning [&_svg]:text-current',
  destructive:
    'border-danger bg-danger text-danger [&_[data-alert-description]]:text-danger-muted [&_[data-alert-title]]:text-danger [&_svg]:text-current',
};

export const Alert = ({ type = 'note', title, children }: AlertProps) => {
  const label = ALERT_LABEL[type];
  const Icon = ALERT_ICON[type];

  return (
    <aside
      className={twMerge(
        'mt-8 grid grid-cols-leading-icon gap-x-3 rounded-lg border px-4 py-3.5',
        'border-default bg-fill-weak text-primary',
        '[&_p:first-child]:mt-0 [&_p]:mt-2',
        '[&_ol]:mt-2 [&_ul]:mt-2',
        ALERT_TYPE_CLASS[type]
      )}
      data-alert={type}
    >
      <Icon className='mt-0.5 size-4' aria-hidden='true' />
      <div className='font-semibold text-primary text-label leading-snug' data-alert-title>
        {title ?? label}
      </div>
      <div
        className='col-start-2 mt-1 text-tertiary text-label leading-relaxed'
        data-alert-description
      >
        {children}
      </div>
    </aside>
  );
};
