/**
 * 文章页 JSON-LD 结构化数据
 * 站点级 WebSite / Person / Blog 已静态写在 index.html，
 * 这里只放文章级 BlogPosting 和 BreadcrumbList，由 InterviewArticle.vue 动态注入 <head>。
 */

import { articles } from '@/views/articles/articles-data'
import { articleSections } from '@/views/articles/interview-content'

// 与 index.html 中站点级 JSON-LD 的 URL / @id 保持一致，改域名或仓库名时两处同步
const SITE_URL = 'https://xiaoqiu1219.github.io/vue3-Ts--BLOG'
const PERSON_ID = `${SITE_URL}/#person`
const BLOG_ID = `${SITE_URL}/#blog`

const article = articles.find(item => item.id === 'interview-advanced')
if (!article) {
  throw new Error('未找到文章数据：interview-advanced')
}

/** 文章页的标题、描述、日期等展示与 SEO 共用字段 */
export const articleMeta = {
  title: article.title,
  date: article.date,
  tag: article.tag,
  description: article.excerpt,
  url: `${SITE_URL}${article.path}`,
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BlogPosting',
      '@id': `${articleMeta.url}#article`,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': articleMeta.url,
      },
      'url': articleMeta.url,
      'headline': articleMeta.title,
      'description': articleMeta.description,
      'datePublished': articleMeta.date,
      'dateModified': articleMeta.date,
      'inLanguage': 'zh-CN',
      'timeRequired': 'PT45M',
      'author': { '@id': PERSON_ID },
      'publisher': { '@id': PERSON_ID },
      'isPartOf': { '@id': BLOG_ID },
      'articleSection': articleSections.map(section => section.label),
      'keywords': [
        '前端面试',
        '高级前端工程师',
        'JavaScript',
        'Vue 3',
        'TypeScript',
        '前端工程化',
        '性能优化',
        'Web 安全',
        'UniApp',
        '系统设计',
      ],
      'about': [
        { '@type': 'Thing', 'name': '前端面试' },
        { '@type': 'Thing', 'name': 'Vue.js' },
        { '@type': 'Thing', 'name': 'TypeScript' },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${articleMeta.url}#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': '首页',
          'item': `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': '文章',
          'item': `${SITE_URL}/articles`,
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': articleMeta.title,
          'item': articleMeta.url,
        },
      ],
    },
  ],
}

/** 预序列化，避免每次进入文章页重复 JSON.stringify */
export const articleSchemaJson = JSON.stringify(articleSchema)
