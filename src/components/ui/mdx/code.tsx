import type { ComponentProps } from 'react';
import { codeToHtml, createCssVariablesTheme } from 'shiki';

const cssVariablesTheme = createCssVariablesTheme({});
const LANGUAGE_CLASS_REGEX = /language-([\w-]+)/;

export const Pre = (props: ComponentProps<'pre'>) => (
  <pre className='mt-6 whitespace-pre md:whitespace-pre-wrap md:leading-relaxed' {...props} />
);

type CodeProps = ComponentProps<'code'> & {
  'data-language'?: string;
};

const extractCodeLanguage = (className?: string, dataLanguage?: string): string => {
  if (dataLanguage) {
    return dataLanguage;
  }

  const matched = className?.match(LANGUAGE_CLASS_REGEX)?.[1];
  return matched ?? 'text';
};

export const Code = async (props: CodeProps) => {
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
