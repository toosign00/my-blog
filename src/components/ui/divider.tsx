import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { twMerge } from '@/design-system/tw-merge';

type DividerProps = {
  className?: string;
} & ComponentPropsWithoutRef<'hr'>;

export const Divider = forwardRef<HTMLHRElement, DividerProps>(({ className, ...props }, ref) => {
  return (
    <hr
      className={twMerge('divider-gradient h-divider w-full border-none', className)}
      ref={ref}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';
