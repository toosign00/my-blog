import type { MDXComponents } from 'mdx/types';

import { components } from '@/components/ui/mdx';

export function useMDXComponents(inherited: MDXComponents): MDXComponents {
  return {
    ...inherited,
    ...components,
  };
}
