/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {BlogPostProvider} from "@docusaurus/plugin-content-blog/client";
import BlogPostItem from '@site/src/components/BlogPostItem';
import type {Props} from '@theme/BlogPostItems';

export default function BlogPostItems({
  items,
}: Props): JSX.Element {
  return (
    <>
      {items.map(({content: BlogPostContent}) => (
        <BlogPostProvider
          key={BlogPostContent.metadata.permalink}
          content={BlogPostContent}>
          <BlogPostItem>
            <BlogPostContent />
          </BlogPostItem>
        </BlogPostProvider>
      ))}
    </>
  );
}
