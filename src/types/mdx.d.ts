declare module '*.mdx' {
  import type { ComponentType } from 'react';

  type MDXContent = ComponentType<Record<string, unknown>>;

  export const metadata: Record<string, unknown> | undefined;
  export const frontmatter: Record<string, unknown> | undefined;

  const MDXComponent: MDXContent;
  export default MDXComponent;
}
