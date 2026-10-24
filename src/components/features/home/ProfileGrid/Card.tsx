import { type ComponentPropsWithoutRef, type ElementType, forwardRef, type ReactNode } from 'react';
import { cardClass } from '@/components/ui/Card';
import { twMerge } from '@/utils/tw-merge-util';

type CardProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & ComponentPropsWithoutRef<'div'>;

const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { as: Component = 'div', className, children, ...props },
  ref
) {
  return (
    <Component
      className={cardClass({
        className: `relative mt-8 h-48 w-full overflow-hidden ${className ?? ''}`,
      })}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
});

type CardContentProps = ComponentPropsWithoutRef<'div'>;

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { children, className, ...props },
  ref
) {
  return (
    <div className={twMerge('row-between h-full w-full p-5', className)} ref={ref} {...props}>
      {children}
    </div>
  );
});

export default { Root: Card, Content: CardContent };
