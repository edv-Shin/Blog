import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {BlogPostProvider} from "@docusaurus/plugin-content-blog/client";
import React from "react";
import BlogPostItem from "@site/src/components/BlogPostItem";
import styles from './Home.module.css'


export default function Home(props: Record<string, any>): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}>
      <h1 className={styles.title}>저장 공간</h1>
      <div className={styles.container}>
        {props.recentPosts.map(({content: BlogPostContent}) => (
          <BlogPostProvider
            key={BlogPostContent.metadata.permalink}
            content={BlogPostContent}
          >
            <BlogPostItem />
          </BlogPostProvider>
        ))}
      </div>
    </Layout>
  );
}
