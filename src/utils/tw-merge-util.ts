import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge that knows the design system's type scale (tokens/typography.css).
 * Without it, `text-label` is read as a text color and dropped when merged with `text-tertiary`.
 */
export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        'display',
        'display-sm',
        'title-lg',
        'title',
        'heading-lg',
        'heading',
        'body-lg',
        'body',
        'label',
        'caption',
        'caption-sm',
        'micro',
      ],
    },
  },
});
