import type {Props} from '@theme/BlogPostItem';

import React from 'react';
import clsx from 'clsx';
import {useBlogPost} from "@docusaurus/plugin-content-blog/client";
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';

// apply a bottom margin in list view
function useContainerClassName() {
  const {isBlogPostPage} = useBlogPost();
  return !isBlogPostPage ? 'margin-bottom--xl' : undefined;
}

export default function BlogPostItem({
  children,
  className,
}: Partial<Props>): JSX.Element {
  const containerClassName = useContainerClassName();
  return (
    <BlogPostItemContainer className={clsx(containerClassName, className)}>
      <BlogPostItemHeader />
    </BlogPostItemContainer>
  );
}
