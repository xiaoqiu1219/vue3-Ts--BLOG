// src/api/admin.ts
// 后台管理 API — 通用分页查询接口 + mock 数据生成器
import { get } from './request'
import type { PageResult, PageParams } from '@/composables/useTable'

// ===== Mock 数据生成器 =====

// 模拟 10 万条用户数据，用于展示虚拟表格性能
function generateMockUsers(total: number) {
  const roles = ['管理员', '编辑', '普通用户', '访客']
  const statuses = ['启用', '禁用']
  const departments = [
    '技术部', '产品部', '设计部', '运营部', '市场部', '人事部', '财务部', '法务部',
    '销售部', '客服部', '数据部', '行政部', '研发一部', '研发二部', '测试部',
  ]
  const cities = [
    '北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '南京',
    '西安', '重庆', '长沙', '郑州', '苏州', '天津', '青岛', '厦门',
  ]

  const users = []
  for (let i = 1; i <= total; i++) {
    users.push({
      id: i,
      name: `用户${String(i).padStart(6, '0')}`,
      email: `user${i}@example.com`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      department: departments[i % departments.length],
      city: cities[i % cities.length],
      createdAt: new Date(2024, 0, 1 + (i % 365)).toISOString().slice(0, 10),
    })
  }
  return users
}

const allMockUsers = generateMockUsers(100000)

// Mock 数据获取函数：支持搜索过滤 + 分页
export async function mockFetchUsers(params: PageParams): Promise<PageResult<unknown>> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400))

  let filtered = [...allMockUsers]

  // 根据搜索参数过滤
  const search = (params as Record<string, unknown>).search as string
  if (search) {
    const keyword = search.toLowerCase()
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        u.department.toLowerCase().includes(keyword),
    )
  }

  const role = (params as Record<string, unknown>).role as string
  if (role) {
    filtered = filtered.filter((u) => u.role === role)
  }

  const status = (params as Record<string, unknown>).status as string
  if (status) {
    filtered = filtered.filter((u) => u.status === status)
  }

  const dateStart = (params as Record<string, unknown>).dateStart as string
  if (dateStart) {
    filtered = filtered.filter((u) => u.createdAt >= dateStart)
  }

  const dateEnd = (params as Record<string, unknown>).dateEnd as string
  if (dateEnd) {
    filtered = filtered.filter((u) => u.createdAt <= dateEnd)
  }

  const departments = (params as Record<string, unknown>).departments as string[]
  if (departments && departments.length > 0) {
    filtered = filtered.filter((u) => departments.includes(u.department))
  }

  const total = filtered.length
  const { page, pageSize } = params
  const start = (page - 1) * pageSize
  const data = filtered.slice(start, start + pageSize)

  return { data, total }
}

// ===== 真实 API =====

export interface AdminUser {
  id: number
  name: string
  email: string
  role: string
  status: string
  department: string
  city: string
  createdAt: string
}

// 真实 API 获取用户列表（接口路径按实际后端调整）
export async function fetchUsers(params: PageParams): Promise<PageResult<AdminUser>> {
  return get<PageResult<AdminUser>>('/api/admin/users', { params })
}
