import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { codeToHtml, createCssVariablesTheme } from "shiki";
import { twMerge } from "tailwind-merge";

import { LazyImage } from "./lazyImage";

const cssVariablesTheme = createCssVariablesTheme({});

const H1 = (props: ComponentProps<"h1">) => (
  <h1
    className="mb-6 text-balance font-semibold text-gray-accent text-xl"
    {...props}
  />
);
const H2 = (props: ComponentProps<"h2">) => (
  <h2
    className="mt-12 mb-6 text-balance font-semibold text-gray-accent text-lg"
    {...props}
  />
);
const H3 = (props: ComponentProps<"h3">) => (
  <h3
    className="mt-12 mb-6 text-balance font-semibold text-gray-accent"
    {...props}
  />
);
const H4 = (props: ComponentProps<"h4">) => (
  <h4
    className="mt-12 mb-6 text-balance font-semibold text-gray-accent text-base"
    {...props}
  />
);
const UL = (props: ComponentProps<"ul">) => (
  <ul
    className="mt-6 flex list-outside list-disc flex-col gap-2 pl-5"
    {...props}
  />
);
const OL = (props: ComponentProps<"ol">) => (
  <ol
    className="mt-6 flex list-outside list-decimal flex-col gap-2 pl-5"
    {...props}
  />
);
const LI = (props: ComponentProps<"li">) => (
  <li
    className="pl-1 font-normal text-md leading-relaxed [&_ol]:mt-2 [&_ul]:mt-2"
    {...props}
  />
);

type AnchorProps = Omit<ComponentProps<"a">, "href"> & { href?: string };
const A = ({ href, ...props }: AnchorProps) => (
  <Link
    className={twMerge(
      "break-keep underline decoration-from-font underline-offset-3 transition-colors duration-150",
      "outline-offset-2 hover:opacity-80",
      href?.startsWith("https://") && "external-link",
    )}
    draggable={false}
    href={href ?? ""}
    {...(href?.startsWith("https://")
      ? {
          target: "_blank",
          rel: "noopener noreferrer",
        }
      : {})}
    {...props}
  />
);

const Strong = (props: ComponentProps<"strong">) => (
  <strong className="font-semibold text-md" {...props} />
);

const P = (props: ComponentProps<"p">) => (
  <p
    className="post-body mt-6 font-normal text-gray-accent text-md"
    {...props}
  />
);

const Blockquote = (props: ComponentProps<"blockquote">) => (
  <blockquote
    className="column -ml-6 rounded-md border border-border bg-background02 p-4 pl-6 sm:-ml-10 sm:pl-10 md:-ml-14 md:pl-14"
    {...props}
  />
);

const Pre = (props: ComponentProps<"pre">) => (
  <pre className="mt-6 whitespace-pre md:whitespace-pre-wrap" {...props} />
);

type CodeProps = ComponentProps<"code"> & {
  "data-language"?: string;
};
const LANGUAGE_CLASS_REGEX = /language-([\w-]+)/;

const extractCodeLanguage = (
  className?: string,
  dataLanguage?: string,
): string => {
  if (dataLanguage) {
    return dataLanguage;
  }

  const matched = className?.match(LANGUAGE_CLASS_REGEX)?.[1];
  return matched ?? "text";
};

const Code = async (props: CodeProps) => {
  if (typeof props.children === "string" && props.className) {
    const language = extractCodeLanguage(
      props.className,
      props["data-language"],
    );

    try {
      const highlightedCode = codeToHtml(props.children, {
        lang: language,
        theme: cssVariablesTheme,
        transformers: [
          {
            pre: (hast) => {
              if (hast.children.length !== 1) {
                throw new Error("<pre>: Expected a single <code> child");
              }
              if (hast.children[0]?.type !== "element") {
                throw new Error("<pre>: Expected a <code> child");
              }
              return hast.children[0];
            },
            postprocess(html) {
              return html.replace(/^<code>|<\/code>$/g, "");
            },
          },
        ],
      });

      return (
        <code
          className="shiki css-variables inline text-xs md:text-sm"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required to render the highlighted code.
          dangerouslySetInnerHTML={{ __html: await highlightedCode }}
        />
      );
    } catch {
      const highlightedCode = codeToHtml(props.children, {
        lang: "text",
        theme: cssVariablesTheme,
      });

      return (
        <code
          className="shiki css-variables inline text-xs md:text-sm"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: required to render the highlighted code.
          dangerouslySetInnerHTML={{ __html: await highlightedCode }}
        />
      );
    }
  }

  return <code className="inline" {...props} />;
};

type ImgProps = Omit<ComponentProps<"img">, "src" | "alt"> & {
  src?: string;
  alt?: string;
};
const Img = async ({ src, alt, ...props }: ImgProps) => {
  if (!src) {
    return null;
  }

  if (src.startsWith("https://")) {
    return (
      <LazyImage
        alt={alt ?? ""}
        className="h-auto max-w-full"
        draggable={false}
        src={src}
        {...props}
      />
    );
  }

  try {
    const image = await import(`../../assets/images/${src}`);

    return (
      <Image
        alt={alt ?? ""}
        draggable={false}
        placeholder="blur"
        quality={95}
        src={image.default}
      />
    );
  } catch {
    return <p>Image Loading Error (src: {src})</p>;
  }
};

const HR = (props: ComponentProps<"hr">) => (
  <hr className="mx-auto my-12 w-24 border-border" {...props} />
);

interface StepsProps {
  children: ReactNode;
}

const Steps = ({ children }: StepsProps) => (
  <ol className="mt-6 flex flex-col gap-6 border-l border-border pl-6 [counter-reset:steps]">
    {children}
  </ol>
);

interface StepProps {
  title: ReactNode;
  children: ReactNode;
}

const Step = ({ title, children }: StepProps) => (
  <li className="relative [counter-increment:steps] before:absolute before:-left-9 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:border before:border-border before:bg-background before:text-xs before:font-medium before:text-gray-mid before:content-[counter(steps)]">
    <p className="mb-2 font-semibold text-gray-accent">{title}</p>
    <div className="text-base text-gray-bold leading-relaxed">{children}</div>
  </li>
);

interface TableProps {
  headers: string[];
  rows: string[][];
}

function TableCell({ cell, bordered }: { cell: string; bordered: boolean }) {
  return (
    <td
      className={`px-4 py-2.5 text-gray-bold${bordered ? " border-b border-border" : ""}`}
    >
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

        return (
          <TableCell
            key={`${cell}-${occurrence}`}
            cell={cell}
            bordered={bordered}
          />
        );
      })}
    </tr>
  );
}

const Table = ({ headers, rows }: TableProps) => (
  <div className="mt-6 w-full overflow-x-auto rounded-lg border border-border">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              className="border-b border-border bg-background02 px-4 py-2.5 text-left font-medium text-gray-mid"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <TableRow
            key={row.join("|")}
            row={row}
            bordered={i < rows.length - 1}
          />
        ))}
      </tbody>
    </table>
  </div>
);

interface HighlightProps {
  children: ReactNode;
  color?: "yellow" | "blue" | "green" | "purple" | "red";
}

const HIGHLIGHT_COLOR: Record<NonNullable<HighlightProps["color"]>, string> = {
  yellow:
    "bg-yellow-100/80 dark:bg-yellow-400/15 text-yellow-900 dark:text-yellow-300",
  blue: "bg-blue-100/80 dark:bg-blue-400/15 text-blue-900 dark:text-blue-300",
  green:
    "bg-green-100/80 dark:bg-green-400/15 text-green-900 dark:text-green-300",
  purple:
    "bg-purple-100/80 dark:bg-purple-400/15 text-purple-900 dark:text-purple-300",
  red: "bg-red-100/80 dark:bg-red-400/15 text-red-900 dark:text-red-300",
};

const Highlight = ({ children, color = "yellow" }: HighlightProps) => (
  <mark
    className={`rounded px-1 py-0.5 font-medium not-italic ${HIGHLIGHT_COLOR[color]}`}
  >
    {children}
  </mark>
);

type CalloutType = "note" | "tip" | "warning" | "important";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const CALLOUT_LABEL: Record<CalloutType, string> = {
  note: "Note",
  tip: "Tip",
  warning: "Warning",
  important: "Important",
};

const Callout = ({ type = "note", title, children }: CalloutProps) => {
  const label = CALLOUT_LABEL[type];

  return (
    <aside
      className={twMerge(
        "column mt-6 gap-2 rounded-lg border p-3",
        "border-callout-border bg-callout-bg text-gray-accent",
        "[&_p:first-child]:mt-0 [&_p]:mt-2",
        "[&_ol]:mt-2 [&_ul]:mt-2",
      )}
      data-callout={type}
    >
      <div className="h6 font-medium" data-callout-title>
        {title ?? label}
      </div>
      <div className="mt-1">{children}</div>
    </aside>
  );
};

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
  Callout,
  Steps,
  Step,
  Table,
  Highlight,
  Image,
};
