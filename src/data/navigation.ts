/** 导航配置 — AppNavbar 数据源。label 为 i18n key，渲染时用 t() 翻译 */

export interface NavItem {
  path: string
  /** i18n key */
  label: string
}

export const mainNav: NavItem[] = [
  { path: '/', label: 'nav.home' },
  { path: '/timeline', label: 'nav.timeline' },
  { path: '/articles', label: 'nav.articles' },
  { path: '/experience', label: 'nav.experience' },
  { path: '/friends', label: 'nav.friends' },
]

export const practiceNav: NavItem[] = [
  { path: '/practice/home', label: 'nav.practiceHome' },
  { path: '/practice/about', label: 'nav.practiceAbout' },
  { path: '/practice/modal', label: 'nav.practiceModal' },
]

export const gamesNav: NavItem[] = [
  { path: '/games', label: 'nav.gamesHub' },
  { path: '/games/guess-number', label: 'nav.guessNumber' },
]

export { adminNav } from './admin-navigation'