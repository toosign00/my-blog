import type { ComponentProps } from 'react';
import { twMerge } from '@/design-system/tw-merge';

export type ButtonVariant = 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonClassOptions = {
  variant?: ButtonVariant;
  /** Applies to the outline variant. Ghost buttons size to their content. */
  size?: ButtonSize;
  className?: string;
};

const BASE_CLASS =
  'focus-ring inline-flex cursor-pointer select-none items-center justify-center gap-2 no-underline';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  outline:
    'border border-default bg-surface font-medium text-primary transition-colors duration-fast ease-in-out hover:bg-fill-weak',
  ghost:
    'hover-fade w-fit py-1 pr-2 font-semibold text-body text-primary leading-none tracking-tight',
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-md px-3 text-caption',
  md: 'h-10 rounded-md px-3 text-caption',
  lg: 'h-12 rounded-lg px-4 text-label',
};

/** Button classes, for links and other elements that should look like a button. */
export const buttonClass = ({
  variant = 'outline',
  size = 'md',
  className,
}: ButtonClassOptions = {}) =>
  twMerge(BASE_CLASS, VARIANT_CLASS[variant], variant === 'outline' && SIZE_CLASS[size], className);

type ButtonProps = Omit<ComponentProps<'button'>, 'type'> &
  Omit<ButtonClassOptions, 'className'> & {
    type?: 'button' | 'submit' | 'reset';
  };

export const Button = ({ variant, size, className, type = 'button', ...props }: ButtonProps) => (
  <button className={buttonClass({ variant, size, className })} type={type} {...props} />
);
