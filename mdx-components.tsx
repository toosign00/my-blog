import type { MDXComponents } from 'mdx/types';

import { components } from '@/components/features/mdx';

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
  return {
    ...inherited,
    ...components,
  };
}
