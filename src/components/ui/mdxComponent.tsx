import { CircleAlert, Info, Lightbulb, type LucideIcon, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { codeToHtml, createCssVariablesTheme } from 'shiki';
import { twMerge } from 'tailwind-merge';

import { getRemoteImagePlaceholder } from '@/utils/image-placeholder-util';
import { LazyImage } from './lazyImage';
import { Accordion, AccordionItem, Tab, Tabs } from './mdxInteractive';

const cssVariablesTheme = createCssVariablesTheme({});

const toHeadingId = (children: ReactNode): string => {
  const text = typeof children === 'string' ? children : '';
  return text
    .toLowerCase()
    .replace(/[^\w\sㄱ-힣]/g, '')
    .replace(/\s+/g, '-');
};

const H1 = (props: ComponentProps<'h1'>) => (
  <h1 className='mb-6 text-balance font-semibold text-gray-accent text-xl' {...props} />
);
const H2 = ({ children, ...props }: ComponentProps<'h2'>) => (
  <h2
    id={toHeadingId(children)}
    className='mt-12 mb-6 text-balance font-semibold text-gray-accent text-lg leading-tight tracking-[-0.01em]'
    {...props}
  >
    {children}
  </h2>
);
const H3 = ({ children, ...props }: ComponentProps<'h3'>) => (
  <h3
    id={toHeadingId(children)}
    className='mt-12 mb-6 text-balance font-semibold text-gray-accent leading-tight tracking-[-0.01em]'
    {...props}
  >
    {children}
  </h3>
);
const H4 = (props: ComponentProps<'h4'>) => (
  <h4
    className='mt-12 mb-6 text-balance font-semibold text-gray-accent text-base leading-snug'
    {...props}
  />
);
const UL = (props: ComponentProps<'ul'>) => (
  <ul className='mt-6 flex list-outside list-disc flex-col gap-2 pl-5' {...props} />
);
const OL = (props: ComponentProps<'ol'>) => (
  <ol className='mt-6 flex list-outside list-decimal flex-col gap-2 pl-5' {...props} />
);
const LI = (props: ComponentProps<'li'>) => (
  <li className='pl-1 font-normal text-md leading-relaxed [&_ol]:mt-2 [&_ul]:mt-2' {...props} />
);

type AnchorProps = Omit<ComponentProps<'a'>, 'href'> & { href?: string };
const A = ({ href, ...props }: AnchorProps) => (
  <Link
    className={twMerge(
      'break-keep underline decoration-from-font underline-offset-3 transition-colors duration-150',
      'text-gray-bold outline-offset-2 hover:text-gray-accent hover:opacity-80',
      href?.startsWith('https://') && 'external-link'
    )}
    draggable={false}
    href={href ?? ''}
    {...(href?.startsWith('https://')
      ? {
          target: '_blank',
          rel: 'noopener noreferrer',
        }
      : {})}
    {...props}
  />
);

const Strong = (props: ComponentProps<'strong'>) => <strong className='font-medium' {...props} />;

const P = (props: ComponentProps<'p'>) => (
  <p className='post-body mt-6 font-normal text-gray-accent text-md' {...props} />
);

const Blockquote = (props: ComponentProps<'blockquote'>) => (
  <blockquote
    className='column -ml-6 rounded-md border border-border bg-background02 p-4 pl-6 sm:-ml-10 sm:pl-10 md:-ml-14 md:pl-14'
    style={{ borderLeftWidth: '3px' }}
    {...props}
  />
);

const Pre = (props: ComponentProps<'pre'>) => (
  <pre className='mt-6 whitespace-pre md:whitespace-pre-wrap md:leading-relaxed' {...props} />
);

type CodeProps = ComponentProps<'code'> & {
  'data-language'?: string;
};
const LANGUAGE_CLASS_REGEX = /language-([\w-]+)/;

const extractCodeLanguage = (className?: string, dataLanguage?: string): string => {
  if (dataLanguage) {
    return dataLanguage;
  }

  const matched = className?.match(LANGUAGE_CLASS_REGEX)?.[1];
  return matched ?? 'text';
};

const Code = async (props: CodeProps) => {
  if (typeof props.children === 'string' && props.className) {
    const language = extractCodeLanguage(props.className, props['data-language']);

    try {
      const highlightedCode = codeToHtml(props.children, {
        lang: language,
        theme: cssVariablesTheme,
        transformers: [
          {
            pre: (hast) => {
              if (hast.children.length !== 1) {
                throw new Error('<pre>: Expected a single <code> child');
              }
              if (hast.children[0]?.type !== 'element') {
                throw new Error('<pre>: Expected a <code> child');
              }
              return hast.children[0];
            },
            postprocess(html) {
              return html.replace(/^<code>|<\/code>$/g, '');
            },
          },
        ],
      });

      return (
        <code
          className='shiki css-variables inline text-xs md:text-sm'
          dangerouslySetInnerHTML={{ __html: await highlightedCode }}
        />
      );
    } catch {
      const highlightedCode = codeToHtml(props.children, {
        lang: 'text',
        theme: cssVariablesTheme,
      });

      return (
        <code
          className='shiki css-variables inline text-xs md:text-sm'
          dangerouslySetInnerHTML={{ __html: await highlightedCode }}
        />
      );
    }
  }

  return <code className='inline' {...props} />;
};

type ImgProps = Omit<ComponentProps<'img'>, 'src' | 'alt'> & {
  src?: string;
  alt?: string;
};
const Img = async ({ src, alt, ...props }: ImgProps) => {
  if (!src) {
    return null;
  }

  if (src.startsWith('https://')) {
    const placeholder = await getRemoteImagePlaceholder(src);
    return (
      <LazyImage
        alt={alt ?? ''}
        blurDataURL={placeholder?.blurDataURL}
        className={twMerge('h-auto max-w-full', props.className)}
        draggable={props.draggable === true || props.draggable === 'true'}
        height={placeholder?.height}
        src={src}
        style={props.style}
        title={props.title}
        width={placeholder?.width}
      />
    );
  }

  try {
    const image = await import(`../../app/posts/_articles/${src}`);

    return (
      <Image
        alt={alt ?? ''}
        draggable={false}
        placeholder='blur'
        quality={100}
        src={image.default}
      />
    );
  } catch {
    return <p>Image Loading Error (src: {src})</p>;
  }
};

const HR = (props: ComponentProps<'hr'>) => (
  <hr className='mx-auto my-12 w-24 border-border' {...props} />
);

interface StepsProps {
  children: ReactNode;
}

const Steps = ({ children }: StepsProps) => (
  <ol className='mt-6 flex flex-col gap-6 border-l border-border pl-6 [counter-reset:steps]'>
    {children}
  </ol>
);

interface StepProps {
  title: ReactNode;
  children: ReactNode;
}

const Step = ({ title, children }: StepProps) => (
  <li className='relative [counter-increment:steps] before:absolute before:-left-9 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:border before:border-border before:bg-background before:text-xs before:font-medium before:text-gray-mid before:content-[counter(steps)]'>
    <p className='mb-2 font-semibold text-gray-accent'>{title}</p>
    <div className='text-base text-gray-bold leading-relaxed'>{children}</div>
  </li>
);

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

const Table = ({ headers, rows }: TableProps) => (
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

const Highlight = ({ children, color = 'yellow' }: HighlightProps) => (
  <mark className={`rounded px-1 py-0.5 font-medium not-italic ${HIGHLIGHT_COLOR[color]}`}>
    {children}
  </mark>
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

const Alert = ({ type = 'note', title, children }: AlertProps) => {
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

interface BadgeProps {
  children: ReactNode;
  tone?: 'default' | 'muted' | 'outline';
}

const BADGE_TONE_CLASS: Record<NonNullable<BadgeProps['tone']>, string> = {
  default: 'border-transparent bg-gray-bold text-background',
  muted: 'border-border bg-background02 text-gray-mid',
  outline: 'border-border bg-transparent text-gray-bold',
};

const Badge = ({ children, tone = 'muted' }: BadgeProps) => (
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

const Card = ({ title, description, children }: CardProps) => (
  <section className='rounded-xl border border-border bg-background02 p-4'>
    {title && <div className='font-semibold text-gray-accent text-sm leading-snug'>{title}</div>}
    {description && <p className='mt-1 text-gray-mid text-sm leading-relaxed'>{description}</p>}
    {children && <div className='mt-3 text-gray-bold text-sm leading-relaxed'>{children}</div>}
  </section>
);

interface CardGridProps {
  children: ReactNode;
}

const CardGrid = ({ children }: CardGridProps) => (
  <div className='mt-6 grid gap-3 mobile:grid-cols-2'>{children}</div>
);

export const components = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  ul: UL,
  ol: OL,
  li: LI,
  a: A,
  strong: Strong,
  p: P,
  blockquote: Blockquote,
  pre: Pre,
  code: Code,
  img: Img,
  hr: HR,
  Alert,
  Steps,
  Step,
  Table,
  Highlight,
  Badge,
  Card,
  CardGrid,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  Image,
};
