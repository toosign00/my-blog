import { CircleAlert, Info, Lightbulb, type LucideIcon, TriangleAlert } from 'lucide-react';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface StepsProps {
  children: ReactNode;
}

export const Steps = ({ children }: StepsProps) => (
  <ol className='mt-6 flex flex-col gap-6 border-l border-border pl-6 [counter-reset:steps]'>
    {children}
  </ol>
);

interface StepProps {
  title: ReactNode;
  children: ReactNode;
}

export const Step = ({ title, children }: StepProps) => (
  <li className='relative [counter-increment:steps] before:absolute before:-left-9 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:border before:border-border before:bg-background before:text-xs before:font-medium before:text-gray-mid before:content-[counter(steps)]'>
    <p className='mb-2 font-semibold text-gray-accent'>{title}</p>
    <div className='text-base text-gray-bold leading-relaxed'>{children}</div>
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
  note: '',
  tip: '',
  warning:
    'border-alert-warning-border bg-alert-warning-bg text-alert-warning [&_[data-alert-description]]:text-alert-warning-description [&_[data-alert-title]]:text-alert-warning [&_svg]:text-current',
  destructive:
    'border-alert-destructive-border bg-alert-destructive-bg text-alert-destructive [&_[data-alert-description]]:text-alert-destructive-description [&_[data-alert-title]]:text-alert-destructive [&_svg]:text-current',
};

export const Alert = ({ type = 'note', title, children }: AlertProps) => {
  const label = ALERT_LABEL[type];
  const Icon = ALERT_ICON[type];

  return (
    <aside
      className={twMerge(
        'mt-8 grid grid-cols-[auto_1fr] gap-x-3 rounded-xl border px-4 py-3.5',
        'border-alert-border bg-alert-bg text-gray-accent',
        '[&_p:first-child]:mt-0 [&_p]:mt-2',
        '[&_ol]:mt-2 [&_ul]:mt-2',
        ALERT_TYPE_CLASS[type]
      )}
      data-alert={type}
    >
      <Icon className='mt-0.5 size-4 text-alert-icon' aria-hidden='true' />
      <div className='font-semibold text-gray-accent text-sm leading-snug' data-alert-title>
        {title ?? label}
      </div>
      <div
        className='col-start-2 mt-1 text-gray-mid text-sm leading-relaxed'
        data-alert-description
      >
        {children}
      </div>
    </aside>
  );
};
