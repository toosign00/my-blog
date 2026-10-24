import type { ComponentProps } from 'react';
import { twMerge } from '@/design-system/tw-merge';

export type ChipTone = 'soft' | 'outline' | 'solid';
export type ChipSize = 'sm' | 'md' | 'lg';

type ChipClassOptions = {
  tone?: ChipTone;
  size?: ChipSize;
  className?: string;
};

const BASE_CLASS = 'inline-flex items-center gap-1.5 rounded-full border font-medium';

const TONE_CLASS: Record<ChipTone, string> = {
  soft: 'border-default bg-muted text-tertiary',
  outline: 'border-default bg-transparent text-tertiary',
  solid: 'border-transparent bg-inverse text-inverse',
};

const SIZE_CLASS: Record<ChipSize, string> = {
  sm: 'px-2 py-0.5 text-caption-sm',
  md: 'px-3 py-1 text-label',
  lg: 'px-3 py-2 text-label',
};

/** Chip classes, for list items and links that should look like a chip. */
export const chipClass = ({ tone = 'soft', size = 'sm', className }: ChipClassOptions = {}) =>
  twMerge(BASE_CLASS, TONE_CLASS[tone], SIZE_CLASS[size], className);

type ChipProps = ComponentProps<'span'> & Omit<ChipClassOptions, 'className'>;

export const Chip = ({ tone, size, className, ...props }: ChipProps) => (
  <span className={chipClass({ tone, size, className })} {...props} />
);
