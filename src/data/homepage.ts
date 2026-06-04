/** 首页数据 — BlogHome 数据源 */

// === 数据看板 ===
export interface StatItem {
  key: string
  label: string
  target: number
}

export const stats: StatItem[] = [
  { key: 'articles', label: '文章', target: 1 },
  { key: 'tags', label: '标签', target: 1 },
  { key: 'words', label: '累计字数', target: 28000 },
]

// === Bento 导航宫格 ===
export interface BentoItem {
  path: string
  label: string
  desc: string
  icon: string
  color: string
}

export const bentoItems: BentoItem[] = [
  { path: '/articles', label: '文章', desc: '技术思考与实战总结', icon: '✍', color: '#3b82f6' },
  { path: '/timeline', label: '时间线', desc: '成长每一步都算数', icon: '⏳', color: '#06b6d4' },
  { path: '/experience', label: '经历', desc: '核心功能模块一览', icon: '🛠', color: '#8b5cf6' },
  { path: '/friends', label: '友链', desc: '有趣的灵魂在此相遇', icon: '🔗', color: '#f472b6' },
]

// === 技能雷达 ===
export interface SkillItem {
  name: string
  years: string
  level: number
  color: string
}

export const skills: SkillItem[] = [
  { name: 'Vue 3 / Vue 2', years: '5年', level: 92, color: 'linear-gradient(90deg, #06b6d4, #3b82f6)' },
  { name: 'TypeScript', years: '3年', level: 80, color: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' },
  { name: 'UniApp 跨端', years: '3年', level: 78, color: 'linear-gradient(90deg, #10b981, #06b6d4)' },
  { name: 'ECharts / 可视化', years: '3年', level: 72, color: 'linear-gradient(90deg, #f59e0b, #ef4444)' },
  { name: 'Node.js / 工程化', years: '2年', level: 65, color: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' },
  { name: 'CI/CD / DevOps', years: '1年', level: 50, color: 'linear-gradient(90deg, #6366f1, #818cf8)' },
]

// === 微型时间线 ===
export interface MiniTimelineItem {
  date: string
  title: string
  org: string
}

export const miniTimeline: MiniTimelineItem[] = [
  { date: '2026.03', title: '博通 IOT / 企尚公众号 / 博通官网 交付', org: '诚讯德通信' },
  { date: '2022.07', title: '加入诚讯德，从零搭建多款产品', org: '诚讯德通信' },
  { date: '2020.07', title: '第一份前端工作，搭建企业后台系统', org: '时励软件' },
  { date: '2019.09', title: '入学计算机网络技术专业', org: '江西冶金职院' },
]
