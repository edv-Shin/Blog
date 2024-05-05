import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {BlogPostProvider} from "@docusaurus/theme-common/internal";
import React from "react";
import BlogPostItem from "@site/src/components/BlogPostItem";
import styles from './Home.module.css'


export default function Home(props: Record<string, any>): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  console.log(props);
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
