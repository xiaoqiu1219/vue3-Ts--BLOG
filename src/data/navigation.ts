/** 导航配置 — AppNavbar 数据源 */

export interface NavItem {
  path: string
  label: string
}

export const mainNav: NavItem[] = [
  { path: '/', label: '首页' },
  { path: '/timeline', label: '时间线' },
  { path: '/articles', label: '文章' },
  { path: '/experience', label: '经历' },
  { path: '/friends', label: '友链' },
]

export const practiceNav: NavItem[] = [
  { path: '/practice/home', label: '练手·首页' },
  { path: '/practice/about', label: '练手·关于' },
  { path: '/practice/modal', label: '练手·弹窗' },
]
