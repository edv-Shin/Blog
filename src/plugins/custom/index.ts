import type {LoadContext, PluginOptions} from "@docusaurus/types";

import path from "node:path";
import {
  DEFAULT_PLUGIN_ID,
  getContentPathList,
  getDataFilePath,
  getPluginI18nPath,
} from "@docusaurus/utils";
import { generateBlogPosts, shouldBeListed} from "@docusaurus/plugin-content-blog/lib/blogUtils.js";

export default async function (context: LoadContext, initialOptions: PluginOptions) {
  const options: PluginOptions & Record<string, any> = {
    path: 'blog',
    authorsMapPath: 'authors.yml',
    include: ['**/*.{md,mdx}'],
    exclude: [
      '**/_*.{js,jsx,ts,tsx,md,mdx}',
      '**/_*/**',
      '**/*.test.{js,jsx,ts,tsx}',
      '**/__tests__/**'
    ],
    routeBasePath: 'blog',
    tagsBasePath: 'tags',
    showReadingTime: false,
    truncateMarker: /<!--\s*truncate\s*-->|\{\/\*\s*truncate\s*\*\/\}/,
    id: DEFAULT_PLUGIN_ID,
    ...initialOptions,
  }
  const {
    siteDir,
    siteConfig,
    generatedFilesDir,
    localizationDir,
    i18n: {currentLocale},
  } = context;
  const { baseUrl} = siteConfig;

  const contentPaths = {
    contentPath: path.resolve(siteDir, options.path),
    contentPathLocalized: getPluginI18nPath({
      localizationDir,
      pluginName: 'docusaurus-plugin-content-blog',
      pluginId: options.id,
    }),
  };

  const authorsMapFilePath = await getDataFilePath({
    filePath: options.authorsMapPath,
    contentPaths,
  });
  return {
    name: 'custom-plugin',

    getPathsToWatch() {
      const include = options.include;
      const contentMarkdownGlobs = getContentPathList(contentPaths).flatMap(
        (contentPath) => include.map((pattern) => `${contentPath}/${pattern}`),
      );

      return [authorsMapFilePath, ...contentMarkdownGlobs].filter(
        Boolean,
      ) as string[];
    },

    async loadContent() {
      let blogPosts = await generateBlogPosts(contentPaths, context, options as any);
      // blogPosts = await applyProcessBlogPosts({
      //   blogPosts,
      //   processBlogPosts: ({ blogPosts }) => blogPosts,
      // });
      const listedBlogPosts = blogPosts.filter(shouldBeListed);
      return {
        blogPosts: listedBlogPosts.slice(0, 5),
      };
    },
    async contentLoaded({ content, actions }) {
      console.log({content})
      if (!content) {
        return;
      }
      const recentPosts = [...content.blogPosts].splice(0, 5);

      actions.addRoute({
        // Add route for the home page
        path: "/",
        exact: true,

        // The component to use for the "Home" page route
        component: "@site/src/components/Home.tsx",

        // These are the props that will be passed to our "Home" page component
        modules: {
          recentPosts: recentPosts.map((post) => ({
            content: {
              __import: true,
              // The markdown file for the blog post will be loaded by webpack
              path: post.metadata.source,
              query: {
                truncated: true,
              },
            },
          })),
        },
      });
    },
  };
}