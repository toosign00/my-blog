declare module "*.mdx" {
  import type { MDXContent } from "@types/mdx";

  const content: MDXContent;
  export default content;
}
