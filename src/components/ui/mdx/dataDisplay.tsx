import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface TableProps {
  headers: string[];
  rows: string[][];
}

function TableCell({ cell, bordered }: { cell: string; bordered: boolean }) {
  return (
    <td className={`px-4 py-2.5 text-gray-bold${bordered ? ' border-b border-border' : ''}`}>
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
  <div className='ui-card mt-6 w-full overflow-x-auto rounded-lg'>
    <table className='w-full border-collapse text-sm'>
      <thead>
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              className='border-b border-border bg-background02 px-4 py-2.5 text-left font-medium text-gray-mid'
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
  yellow: 'bg-yellow-100/80 dark:bg-yellow-400/15 text-yellow-900 dark:text-yellow-300',
  blue: 'bg-blue-100/80 dark:bg-blue-400/15 text-blue-900 dark:text-blue-300',
  green: 'bg-green-100/80 dark:bg-green-400/15 text-green-900 dark:text-green-300',
  purple: 'bg-purple-100/80 dark:bg-purple-400/15 text-purple-900 dark:text-purple-300',
  red: 'bg-red-100/80 dark:bg-red-400/15 text-red-900 dark:text-red-300',
};

export const Highlight = ({ children, color = 'yellow' }: HighlightProps) => (
  <mark className={`rounded px-1 py-0.5 font-medium not-italic ${HIGHLIGHT_COLOR[color]}`}>
    {children}
  </mark>
);

interface BadgeProps {
  children: ReactNode;
  tone?: 'default' | 'muted' | 'outline';
}

const BADGE_TONE_CLASS: Record<NonNullable<BadgeProps['tone']>, string> = {
  default: 'border-transparent bg-gray-bold text-background',
  muted: 'border-border bg-background02 text-gray-mid',
  outline: 'border-border bg-transparent text-gray-bold',
};

export const Badge = ({ children, tone = 'muted' }: BadgeProps) => (
  <span
    className={twMerge(
      'inline-flex items-center rounded-full border px-2 py-0.5 font-medium text-xs leading-5',
      BADGE_TONE_CLASS[tone]
    )}
  >
    {children}
  </span>
);

interface CardProps {
  children?: ReactNode;
  description?: ReactNode;
  title?: ReactNode;
}

export const Card = ({ title, description, children }: CardProps) => (
  <section className='rounded-xl border border-border bg-background02 p-4'>
    {title && <div className='font-semibold text-gray-accent text-sm leading-snug'>{title}</div>}
    {description && <p className='mt-1 text-gray-mid text-sm leading-relaxed'>{description}</p>}
    {children && <div className='mt-3 text-gray-bold text-sm leading-relaxed'>{children}</div>}
  </section>
);

interface CardGridProps {
  children: ReactNode;
}

export const CardGrid = ({ children }: CardGridProps) => (
  <div className='mt-6 grid gap-3 mobile:grid-cols-2'>{children}</div>
);
