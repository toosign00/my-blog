import type { ComponentProps } from 'react';
import { twMerge } from '@/design-system/tw-merge';

export type CardPadding = 'none' | 'md' | 'lg';

type CardClassOptions = {
  padding?: CardPadding;
  /** Adds a hover background for cards that are links or contain one. */
  interactive?: boolean;
  className?: string;
};

const BASE_CLASS = 'rounded-lg border border-default bg-surface';

const PADDING_CLASS: Record<CardPadding, string> = {
  none: '',
  md: 'p-4',
  lg: 'p-5',
};

const INTERACTIVE_CLASS = 'transition-colors duration-fast ease-in-out hover:bg-fill-weak';

/** Card classes, for elements that cannot be rendered through <Card>. */
export const cardClass = ({
  padding = 'none',
  interactive = false,
  className,
}: CardClassOptions = {}) =>
  twMerge(BASE_CLASS, PADDING_CLASS[padding], interactive && INTERACTIVE_CLASS, className);

type CardElement = 'div' | 'section' | 'article';

type CardProps = Omit<ComponentProps<'div'>, 'ref'> &
  Omit<CardClassOptions, 'className'> & {
    as?: CardElement;
  };

export const Card = ({
  as: Component = 'div',
  padding,
  interactive,
  className,
  ...props
}: CardProps) => (
  <Component className={cardClass({ padding, interactive, className })} {...props} />
);
