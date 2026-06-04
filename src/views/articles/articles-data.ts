/** 文章数据 — BlogHome 和 ArticlesView 共享 */

export interface Article {
  id: string
  title: string
  date: string  // YYYY-MM-DD
  tag: string
  excerpt: string
  path: string
  delay: number
}

export const articles: Article[] = [
  {
    id: 'interview-advanced',
    title: '高级前端工程师面试精准答案',
    date: '2026-06-04',
    tag: '面试',
    excerpt: '涵盖 JavaScript 核心、Vue 深度、TypeScript、工程化、性能优化、安全、UniApp 跨端、系统设计等 11 个模块共 24 道高频面试题，附详细解答、代码示例与项目实战经验。',
    path: '/articles/interview-advanced',
    delay: 0,
  },
  // 后续新增文章在此追加即可
]
