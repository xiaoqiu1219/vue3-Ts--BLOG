// src/data/admin-navigation.ts
// 后台管理导航配置 — AppNavbar「更多」下拉数据源。label 为 i18n key。

import type { NavItem } from './navigation'

export const adminNav: NavItem[] = [
  { path: '/admin/manage', label: 'nav.admin' },
]