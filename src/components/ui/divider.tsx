import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type DividerProps = {
  className?: string;
} & ComponentPropsWithoutRef<'hr'>;

export const Divider = forwardRef<HTMLHRElement, DividerProps>(({ className, ...props }, ref) => {
  return (
    <hr
      className={twMerge('theme-color-transition h-[0.03125rem] w-full border-none', className)}
      ref={ref}
      style={{
        backgroundColor: 'var(--color-sidebar-divider)',
        maskImage: 'radial-gradient(circle, #000 0%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 100%)',
      }}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';
