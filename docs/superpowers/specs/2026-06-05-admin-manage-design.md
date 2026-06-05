# 通用后台管理页面 — 设计规格

> 日期：2026-06-05 | 状态：待审核

## 1. 目标

封装一个可复用的后台管理通用页面壳子，放在导航栏「更多」下拉中。页面包含：

- **搜索条件区**：虚拟下拉、输入框、日期、多选，右侧搜索/重置按钮
- **虚拟表格**：百万级数据无卡顿滚动
- **分页器**：默认 20 条/页，可选 20/50/100/500
- **Loading 效果**：表格数据加载时展示骨架屏/加载动画
- **数据双模式**：mock 数据 + 真实 API，通过环境变量切换

## 2. 技术决策

| 决策 | 选择 | 原因 |
|------|------|------|
| UI 组件库 | 不引入 | 保持项目依赖极简 |
| 虚拟化引擎 | `@tanstack/vue-virtual` (~3KB) | 提供可靠的虚拟滚动计算，UI 自己控制 |
| 复用方式 | 模板 + 插槽 | 搜索字段和表格列通过插槽自定义，灵活适配不同场景 |
| 样式 | 独立后台风格 | 浅灰背景 + 白色卡片 + 蓝色主色调，与博客深色主题区分 |
| H5 适配 | 768px / 480px 断点 | 遵循项目现有响应式规范 |

## 3. 文件结构

```
src/
├── views/admin/
│   └── AdminManage.vue             # 通用后台管理页（壳子组件，提供插槽）
├── components/admin/
│   ├── SearchForm.vue              # 搜索表单容器（含内置虚拟下拉/日期/多选）
│   ├── VirtualDropdown.vue         # 虚拟下拉选择器（基于 @tanstack/vue-virtual）
│   ├── VirtualTable.vue            # 虚拟表格（基于 @tanstack/vue-virtual）
│   └── Pagination.vue              # 分页器
├── composables/
│   ├── useSearch.ts                # 搜索逻辑（表单绑定、reset、search）
│   ├── useTable.ts                 # 表格数据管理（loading、分页、API/mock 切换）
│   └── useVirtualScroll.ts         # 虚拟滚动封装
├── data/
│   └── admin-navigation.ts         # 后台导航配置
└── api/
    └── admin.ts                    # 后台管理 API 接口定义（预留）
```

## 4. 组件设计

### 4.1 AdminManage.vue（壳子）

页面级组件，组合 `useSearch` + `useTable`。负责布局（搜索区在上、表格在中、分页在下），通过插槽向使用者暴露搜索字段和表格列的自定义能力。搜索按钮和重置按钮由壳子内置，用户只需关注"放什么字段、渲染什么列"。

**插槽：**
- `search-fields` — 搜索字段区域，使用者在此放置具体输入控件（VirtualDropdown、input、日期选择器等）
- `table-header` — 表头区域，使用者定义 `<th>` 列
- `table-row` — 表格行渲染，作用域插槽 `{ row, index }`，使用者定义每行 `<td>`

**Props：**
- `fetcher: (params: SearchParams) => Promise<PageResult>` — 数据获取函数（mock 或真实 API 由调用方决定，壳子不关心）
- `pageSizes: number[]` — 可选的每页条数，默认 `[20, 50, 100, 500]`
- `defaultPageSize: number` — 默认每页条数，默认 `20`

**暴露（defineExpose）：**
- `refresh()` — 外部可调用刷新（如新增/删除后刷新表格）
- `searchParams` — 当前搜索参数（只读）

### 4.2 SearchForm.vue（搜索表单容器）

纯布局组件，提供搜索区的外框、字段排列（flex-wrap 横向排列，H5 纵向堆叠）和右侧操作按钮。搜索字段完全由插槽传入，不预设字段类型。

**插槽：**
- `default` — 搜索字段区域，使用者放置任意表单控件

**操作按钮（组件内置）：**
- 「搜索」— 触发 `@search` 事件
- 「重置」— 触发 `@reset` 事件

**Props：**
- `searching: boolean` — 是否正在搜索（控制按钮 loading 态）

**Emits：**
- `search` — 点击搜索按钮
- `reset` — 点击重置按钮

### 4.3 VirtualDropdown.vue（虚拟下拉）

**核心能力：**
- 基于 `@tanstack/vue-virtual` 的 `useVirtualizer`，仅渲染可视区域内的选项
- 支持数万条 options 无卡顿
- 内置搜索/过滤：输入关键词实时过滤选项
- 键盘导航：上下箭头 + Enter 选择
- 点击外部关闭

**Props：**
- `options: SelectOption[]` — 选项数据
- `modelValue: string | number` — 选中值
- `placeholder: string`
- `disabled: boolean`
- `filterable: boolean` — 是否支持搜索过滤（默认 true）

### 4.4 VirtualTable.vue（虚拟表格）

**核心能力：**
- 固定表头 (`position: sticky`)，仅行区域虚拟滚动
- `useVirtualizer` 驱动行虚拟化，百万级数据流畅滚动
- Loading 状态：骨架屏动画（3 行灰色闪烁占位）
- 空数据状态：居中提示「暂无数据」

**Props：**
- `data: any[]` — 表格数据
- `columns: ColumnDef[]` — 列定义
- `loading: boolean` — 加载状态
- `rowHeight: number` — 行高（默认 48px）

**插槽：**
- `header` — 表头渲染（可覆盖默认）
- `row` — 行渲染，作用域插槽 `{ row, index, columns }`

### 4.5 Pagination.vue（分页器）

**显示内容：**
- 左侧：共 N 条
- 中间：页码按钮（首尾常驻，当前页 ±2，其余省略号）
- 右侧：每页条数选择器（20/50/100/500，默认 20）

**Props：**
- `total: number` — 总条数
- `pageSize: number` — 每页条数
- `currentPage: number` — 当前页

**Emits：**
- `update:pageSize` — 条数变更
- `update:currentPage` — 页码变更
- `change` — 分页参数变更（统一事件，携带 `{ page, pageSize }`）

## 5. Composable 设计

### 5.1 useSearch

```ts
function useSearch(initialValues: Record<string, any>) {
  const formData = reactive({ ...initialValues })
  const searchParams = ref<Record<string, any>>({})

  function search() {
    searchParams.value = { ...formData }
  }

  function reset() {
    Object.assign(formData, initialValues)
    searchParams.value = {}
  }

  return { formData, searchParams, search, reset }
}
```

### 5.2 useTable

```ts
function useTable<T>(fetcher: (params: any) => Promise<{ data: T[], total: number }>) {
  const data = ref<T[]>([])
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  async function fetch(params: any) {
    loading.value = true
    try {
      const result = await fetcher({ page: page.value, pageSize: pageSize.value, ...params })
      data.value = result.data
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  function onPageChange({ page: p, pageSize: ps }: { page: number, pageSize: number }) {
    page.value = p
    pageSize.value = ps
  }

  return { data, loading, total, page, pageSize, fetch, onPageChange }
}
```

### 5.3 useVirtualScroll

封装 `@tanstack/vue-virtual` 的 `useVirtualizer`，提供统一的行虚拟化 hook。

## 6. 数据流

```
AdminManage.vue (壳子)
  │
  ├─ 接收 props.fetcher  (调用方传入的获取数据函数)
  │
  ├─ useSearch() ──── formData (reactive), search(), reset()
  │     │
  │     └─ provides formData 给插槽内的搜索控件 v-model 绑定
  │     └─ <SearchForm @search @reset :searching>
  │           └─ <slot> ← 使用者放入 VirtualDropdown / input / date / MultiSelect
  │                各自 v-model="formData.xxx"
  │
  ├─ useTable(fetcher) ──── data, loading, total, page, pageSize, fetch()
  │     │
  │     ├─ <VirtualTable :data :loading :columns>
  │     │     ├─ <slot name="table-header"> ← 使用者定义 <th>
  │     │     ├─ <slot name="table-row" :row :index> ← 使用者定义 <td>
  │     │     ├─ 骨架屏 (loading === true 时)
  │     │     └─ 空状态 (data.length === 0 && !loading 时)
  │     │
  │     └─ <Pagination v-model:page v-model:pageSize :total @change>
  │
  └─ watch: searchParams 变化 → fetch(searchParams + page + pageSize)
```

## 7. API / Mock 切换

```ts
// .env
VITE_USE_MOCK=true   // 使用 mock 数据
VITE_USE_MOCK=false  // 使用真实 API

// useTable 中
const resolvedFetcher = import.meta.env.VITE_USE_MOCK === 'true'
  ? mockFetcher
  : realApiFetcher
```

Mock 数据生成器内置于 `useTable` 所在模块，按 `searchParams` 过滤 + 分页返回模拟数据，模拟 200ms 网络延迟以展示 loading 效果。

## 8. 路由与导航

**路由：**

```ts
// router/index.ts 新增
{
  path: '/admin/manage',
  name: 'admin-manage',
  component: () => import('../views/admin/AdminManage.vue'),
}
```

**导航数据：**

```ts
// data/admin-navigation.ts
export const adminNav: NavItem[] = [
  { path: '/admin/manage', label: '📊 后台管理' },
]
```

**AppNavbar.vue：**
在「更多」下拉的 `practiceNav` 列表上方插入 `adminNav` 条目。

## 9. 样式规范

- 背景：`#f5f7fa`（浅灰）
- 卡片/表格：`#ffffff`（白色）
- 主色调：`#409eff`（蓝色，按钮、选中态、链接）
- 字体色：`#303133`（主要）、`#909399`（次要）
- 边框：`#e4e7ed`
- CSS 变量命名空间：`--admin-*`，独立于博客的深色变量体系
- 响应式：768px 以下表格横向滚动，480px 以下搜索字段纵向堆叠

## 10. Loading 效果

- **骨架屏**：表格加载时，显示 5 行灰色占位条，带 `shimmer` 动画（从左到右的高光扫过）
- **搜索按钮**：点击搜索后按钮文案变为「搜索中...」并显示旋转 spinner，搜索完成后恢复
- **首次加载**：进入页面即触发一次空条件搜索，展示骨架屏

## 11. 待实现清单

- [ ] 安装 `@tanstack/vue-virtual` 依赖
- [ ] 创建 `src/composables/useSearch.ts`
- [ ] 创建 `src/composables/useTable.ts`
- [ ] 创建 `src/composables/useVirtualScroll.ts`
- [ ] 创建 `src/views/admin/AdminManage.vue`
- [ ] 创建 `src/components/admin/VirtualDropdown.vue`
- [ ] 创建 `src/components/admin/SearchForm.vue`
- [ ] 创建 `src/components/admin/VirtualTable.vue`
- [ ] 创建 `src/components/admin/Pagination.vue`
- [ ] 创建 `src/data/admin-navigation.ts`
- [ ] 创建 `src/api/admin.ts`
- [ ] 更新路由注册
- [ ] 更新 AppNavbar「更多」下拉
- [ ] H5 响应式适配（768px / 480px）
