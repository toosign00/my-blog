import type { ReactNode } from 'react';
import { cardClass } from '@/design-system/components/Card';
import { Chip, type ChipTone } from '@/design-system/components/Chip';

interface TableProps {
  headers: string[];
  rows: string[][];
}

function TableCell({ cell, bordered }: { cell: string; bordered: boolean }) {
  return (
    <td className={`px-4 py-2.5 text-secondary${bordered ? ' border-b border-default' : ''}`}>
      {cell}
    </td>
  );
}

function TableRow({ row, bordered }: { row: string[]; bordered: boolean }) {
  const cellOccurrenceMap = new Map<string, number>();

  return (
    <tr>
      {row.map((cell) => {
        const occurrence = (cellOccurrenceMap.get(cell) ?? 0) + 1;
        cellOccurrenceMap.set(cell, occurrence);

        return <TableCell key={`${cell}-${occurrence}`} cell={cell} bordered={bordered} />;
      })}
    </tr>
  );
}

export const Table = ({ headers, rows }: TableProps) => (
  <div className={cardClass({ className: 'mt-6 w-full overflow-x-auto' })}>
    <table className='w-full border-collapse text-label'>
      <thead>
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              className='border-b border-default bg-fill-weak px-4 py-2.5 text-left font-medium text-tertiary'
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <TableRow key={row.join('|')} row={row} bordered={i < rows.length - 1} />
        ))}
      </tbody>
    </table>
  </div>
);

interface HighlightProps {
  children: ReactNode;
  color?: 'yellow' | 'blue' | 'green' | 'purple' | 'red';
}

const HIGHLIGHT_COLOR: Record<NonNullable<HighlightProps['color']>, string> = {
  yellow: 'bg-highlight-yellow text-highlight-yellow',
  blue: 'bg-highlight-blue text-highlight-blue',
  green: 'bg-highlight-green text-highlight-green',
  purple: 'bg-highlight-purple text-highlight-purple',
  red: 'bg-highlight-red text-highlight-red',
};

export const Highlight = ({ children, color = 'yellow' }: HighlightProps) => (
  <mark className={`rounded-xs px-1 py-0.5 font-medium not-italic ${HIGHLIGHT_COLOR[color]}`}>
    {children}
  </mark>
);

interface BadgeProps {
  children: ReactNode;
  tone?: 'default' | 'muted' | 'outline';
}

const BADGE_CHIP_TONE: Record<NonNullable<BadgeProps['tone']>, ChipTone> = {
  default: 'solid',
  muted: 'soft',
  outline: 'outline',
};

export const Badge = ({ children, tone = 'muted' }: BadgeProps) => (
  <Chip className={tone === 'outline' ? 'text-secondary' : undefined} tone={BADGE_CHIP_TONE[tone]}>
    {children}
  </Chip>
);

interface CardProps {
  children?: ReactNode;
  description?: ReactNode;
  title?: ReactNode;
}

export const Card = ({ title, description, children }: CardProps) => (
  <section className={cardClass({ padding: 'md', className: 'bg-fill-weak' })}>
    {title && <div className='font-semibold text-primary text-label leading-snug'>{title}</div>}
    {description && <p className='mt-1 text-tertiary text-label leading-relaxed'>{description}</p>}
    {children && <div className='mt-3 text-secondary text-label leading-relaxed'>{children}</div>}
  </section>
);

interface CardGridProps {
  children: ReactNode;
}

export const CardGrid = ({ children }: CardGridProps) => (
  <div className='mt-6 grid gap-3 mobile:grid-cols-2'>{children}</div>
);
