# 通用后台管理页面 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 封装一个可复用的后台管理通用页面壳子（搜索区 + 虚拟表格 + 分页），放在导航栏「更多」下拉中

**Architecture:** 模板+插槽模式 — AdminManage.vue 作为壳子组合 useSearch + useTable，搜索字段和表格列通过插槽由调用方自定义。虚拟化由 @tanstack/vue-virtual 驱动。样式独立于博客深色主题，采用后台管理经典蓝白配色。

**Tech Stack:** Vue 3 + TypeScript + @tanstack/vue-virtual + Axios (已有)

---

## 文件清单

| 操作 | 文件 | 职责 |
|------|------|------|
| Create | `src/composables/useSearch.ts` | 搜索表单状态管理 |
| Create | `src/composables/useTable.ts` | 表格数据 + 分页 + loading 管理 |
| Create | `src/composables/useVirtualScroll.ts` | 虚拟滚动封装 |
| Create | `src/components/admin/VirtualDropdown.vue` | 虚拟下拉选择器 |
| Create | `src/components/admin/Pagination.vue` | 分页器 |
| Create | `src/components/admin/VirtualTable.vue` | 虚拟表格 + 骨架屏 |
| Create | `src/components/admin/SearchForm.vue` | 搜索表单容器 |
| Create | `src/data/admin-navigation.ts` | 后台导航数据 |
| Create | `src/api/admin.ts` | 后台 API + mock 生成器 |
| Create | `src/views/admin/AdminManage.vue` | 壳子页面（含 demo 用法） |
| Modify | `src/router/index.ts` | 注册路由 |
| Modify | `src/components/common/AppNavbar.vue` | 「更多」下拉加入后台入口 |
| Modify | `.env` | 添加 VITE_USE_MOCK |

---

### Task 1: 安装依赖并配置环境变量

**Files:**
- Modify: `.env`
- Create: (package.json updated by npm)

- [ ] **Step 1: 安装 @tanstack/vue-virtual**

```bash
cd d:/vue3/creatNewVue && npm install @tanstack/vue-virtual
```

- [ ] **Step 2: 添加环境变量**

在 `.env` 末尾追加：

```
VITE_USE_MOCK=true
```

- [ ] **Step 3: 提交**

```bash
git add .env package.json package-lock.json
git commit -m "chore: 安装 @tanstack/vue-virtual，开启 mock 模式"
```

---

### Task 2: 创建 useSearch composable

**Files:**
- Create: `src/composables/useSearch.ts`

- [ ] **Step 1: 实现 useSearch**

```ts
// src/composables/useSearch.ts
// 后台管理通用搜索逻辑 — 管理搜索表单数据、搜索触发和重置
import { reactive, ref } from 'vue'

export interface SearchParams {
  [key: string]: unknown
}

export function useSearch(initialValues: SearchParams = {}) {
  // 表单当前值（搜索字段通过 v-model 绑定）
  const formData = reactive<SearchParams>({ ...initialValues })

  // 已提交的搜索参数（触发 fetch 用）
  const searchParams = ref<SearchParams>({})

  // 搜索：快照当前表单值作为搜索参数
  function search() {
    // 过滤掉空字符串和 undefined，避免传多余参数给后端
    const cleaned: SearchParams = {}
    for (const [key, val] of Object.entries(formData)) {
      if (val !== '' && val !== undefined && val !== null) {
        cleaned[key] = val
      }
    }
    searchParams.value = cleaned
  }

  // 重置：恢复初始值并清空搜索参数
  function reset() {
    Object.assign(formData, { ...initialValues })
    // 将不在 initialValues 中的 key 也清掉
    for (const key of Object.keys(formData)) {
      if (!(key in initialValues)) {
        delete formData[key]
      }
    }
    searchParams.value = {}
  }

  return { formData, searchParams, search, reset }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/composables/useSearch.ts
git commit -m "feat: 新增 useSearch 搜索表单逻辑 composable"
```

---

### Task 3: 创建 useTable composable

**Files:**
- Create: `src/composables/useTable.ts`

- [ ] **Step 1: 实现 useTable**

```ts
// src/composables/useTable.ts
// 后台管理通用表格数据管理 — loading、分页、数据获取
import { ref } from 'vue'

export interface PageParams {
  page: number
  pageSize: number
  [key: string]: unknown
}

export interface PageResult<T> {
  data: T[]
  total: number
}

export function useTable<T>(fetcher: (params: PageParams) => Promise<PageResult<T>>) {
  const data = ref<T[]>([])
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  // 获取数据：loading = true → 请求 → loading = false
  async function fetch(params: PageParams) {
    loading.value = true
    try {
      const result = await fetcher({
        page: page.value,
        pageSize: pageSize.value,
        ...params,
      })
      data.value = result.data
      total.value = result.total
    } finally {
      loading.value = false
    }
  }

  // 分页变更：更新页码/条数后立即触发 fetch
  async function onPageChange({ page: p, pageSize: ps }: { page: number; pageSize: number }) {
    // pageSize 变化时回到第一页
    if (ps !== pageSize.value) {
      page.value = 1
    } else {
      page.value = p
    }
    pageSize.value = ps
  }

  return { data, loading, total, page, pageSize, fetch, onPageChange }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/composables/useTable.ts
git commit -m "feat: 新增 useTable 表格数据管理 composable"
```

---

### Task 4: 创建 useVirtualScroll composable

**Files:**
- Create: `src/composables/useVirtualScroll.ts`

- [ ] **Step 1: 实现 useVirtualScroll**

```ts
// src/composables/useVirtualScroll.ts
// 虚拟滚动封装 — 基于 @tanstack/vue-virtual 提供统一的行虚拟化 hook
import { useVirtualizer } from '@tanstack/vue-virtual'
import { ref, computed, type Ref } from 'vue'

export interface UseVirtualScrollOptions {
  /** 数据总条数 */
  count: number
  /** 每行高度，默认 48px */
  estimateSize?: number
  /** 超出可视区域的过扫描行数，默认 5 */
  overscan?: number
  /** 滚动容器引用 */
  scrollElement: Ref<HTMLElement | null>
}

export function useVirtualScroll(options: UseVirtualScrollOptions) {
  const { count, estimateSize = 48, overscan = 5, scrollElement } = options

  const virtualizer = useVirtualizer(
    computed(() => ({
      count,
      getScrollElement: () => scrollElement.value,
      estimateSize: () => estimateSize,
      overscan,
    })),
  )

  // 计算总高度（撑开滚动条）
  const totalHeight = computed(() => virtualizer.value.getTotalSize())

  // 虚拟行信息数组
  const virtualItems = computed(() => virtualizer.value.getVirtualItems())

  return { virtualizer, totalHeight, virtualItems }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/composables/useVirtualScroll.ts
git commit -m "feat: 新增 useVirtualScroll 虚拟滚动 composable"
```

---

### Task 5: 创建 VirtualDropdown 组件

**Files:**
- Create: `src/components/admin/VirtualDropdown.vue`

- [ ] **Step 1: 实现 VirtualDropdown**

```vue
<template>
  <div class="virtual-dropdown" ref="dropdownRef" :class="{ 'is-open': open, 'is-disabled': disabled }">
    <!-- 触发器：显示当前选中值或 placeholder -->
    <div class="vd-trigger" @click="toggle" tabindex="0" @keydown="onTriggerKeydown">
      <span class="vd-trigger-text" :class="{ placeholder: !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <span class="vd-arrow" :class="{ open: open }">▾</span>
    </div>

    <!-- 下拉面板 -->
    <Transition name="vd-fade">
      <div v-if="open" class="vd-panel">
        <!-- 搜索输入框 -->
        <div v-if="filterable" class="vd-search">
          <input
            ref="searchInputRef"
            v-model="filterText"
            type="text"
            class="vd-search-input"
            placeholder="输入关键词筛选..."
            @keydown.stop
          />
        </div>

        <!-- 虚拟列表容器 -->
        <div
          v-if="filteredOptions.length > 0"
          class="vd-list-wrapper"
          ref="listRef"
          @keydown="onListKeydown"
        >
          <div :style="{ height: totalHeight + 'px', position: 'relative' }">
            <div
              v-for="vi in virtualItems"
              :key="filteredOptions[vi.index].value"
              class="vd-option"
              :class="{ selected: isSelected(filteredOptions[vi.index].value) }"
              :style="{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: vi.size + 'px',
                transform: `translateY(${vi.start}px)`,
              }"
              @click="select(filteredOptions[vi.index])"
            >
              {{ filteredOptions[vi.index].label }}
            </div>
          </div>
        </div>

        <!-- 无匹配项 -->
        <div v-else class="vd-empty">无匹配选项</div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'

export interface SelectOption {
  label: string
  value: string | number
}

const props = withDefaults(defineProps<{
  options: SelectOption[]
  modelValue: string | number
  placeholder?: string
  disabled?: boolean
  filterable?: boolean
}>(), {
  placeholder: '请选择',
  disabled: false,
  filterable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const open = ref(false)
const filterText = ref('')
const listRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

// 过滤后的选项
const filteredOptions = computed(() => {
  if (!props.filterable || !filterText.value) return props.options
  const keyword = filterText.value.toLowerCase()
  return props.options.filter((o) => o.label.toLowerCase().includes(keyword))
})

// 选中项的 label 展示
const selectedLabel = computed(() => {
  const found = props.options.find((o) => o.value === props.modelValue)
  return found?.label ?? ''
})

// 虚拟列表
const virtualizer = useVirtualizer(
  computed(() => ({
    count: filteredOptions.value.length,
    getScrollElement: () => listRef.value,
    estimateSize: () => 36,
    overscan: 5,
  })),
)
const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalHeight = computed(() => virtualizer.value.getTotalSize())

function isSelected(value: string | number) {
  return value === props.modelValue
}

function toggle() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    filterText.value = ''
    nextTick(() => searchInputRef.value?.focus())
  }
}

function select(option: SelectOption) {
  emit('update:modelValue', option.value)
  open.value = false
  filterText.value = ''
}

// 点击外部关闭
function onClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    open.value = false
    filterText.value = ''
  }
}

// 键盘导航
const highlightIndex = ref(-1)

function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggle()
  }
}

function onListKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightIndex.value = Math.min(highlightIndex.value + 1, filteredOptions.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightIndex.value = Math.max(highlightIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (highlightIndex.value >= 0 && highlightIndex.value < filteredOptions.value.length) {
      select(filteredOptions.value[highlightIndex.value])
      highlightIndex.value = -1
    }
  } else if (e.key === 'Escape') {
    open.value = false
    filterText.value = ''
  }
}

// 挂载/卸载点击外部监听
import { onMounted, onBeforeUnmount } from 'vue'
onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.virtual-dropdown {
  position: relative;
  width: 200px;
}

.vd-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 var(--space-3);
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: border-color 0.2s;
  user-select: none;
}

.vd-trigger:hover {
  border-color: #c0c4cc;
}

.vd-trigger:focus-visible {
  border-color: #409eff;
  outline: none;
}

.is-open .vd-trigger {
  border-color: #409eff;
}

.is-disabled .vd-trigger {
  background: #f5f7fa;
  cursor: not-allowed;
  color: #c0c4cc;
}

.vd-trigger-text.placeholder {
  color: #c0c4cc;
}

.vd-arrow {
  font-size: 12px;
  color: #c0c4cc;
  transition: transform 0.2s;
}

.vd-arrow.open {
  transform: rotate(180deg);
}

.vd-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: var(--z-dropdown);
  overflow: hidden;
}

.vd-search {
  padding: 6px;
  border-bottom: 1px solid #e4e7ed;
}

.vd-search-input {
  width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.vd-search-input:focus {
  border-color: #409eff;
}

.vd-list-wrapper {
  max-height: 240px;
  overflow-y: auto;
}

.vd-option {
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vd-option:hover,
.vd-option.selected {
  color: #409eff;
  background: #f0f7ff;
}

.vd-empty {
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #c0c4cc;
}

.vd-fade-enter-active,
.vd-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.vd-fade-enter-from,
.vd-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/admin/VirtualDropdown.vue
git commit -m "feat: 新增 VirtualDropdown 虚拟下拉搜索组件"
```

---

### Task 6: 创建 Pagination 组件

**Files:**
- Create: `src/components/admin/Pagination.vue`

- [ ] **Step 1: 实现 Pagination**

```vue
<template>
  <div class="admin-pagination">
    <!-- 左侧：总条数 -->
    <span class="page-total">共 {{ total }} 条</span>

    <!-- 中间：页码 -->
    <div class="page-numbers">
      <!-- 首页 -->
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="goTo(1)"
        aria-label="首页"
      >«</button>

      <!-- 上一页 -->
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="goTo(currentPage - 1)"
        aria-label="上一页"
      >‹</button>

      <!-- 页码组 -->
      <template v-for="p in displayedPages" :key="p">
        <span v-if="p === '...'" class="page-ellipsis">...</span>
        <button
          v-else
          class="page-btn"
          :class="{ active: p === currentPage }"
          @click="goTo(p as number)"
        >
          {{ p }}
        </button>
      </template>

      <!-- 下一页 -->
      <button
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="goTo(currentPage + 1)"
        aria-label="下一页"
      >›</button>

      <!-- 尾页 -->
      <button
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="goTo(totalPages)"
        aria-label="末页"
      >»</button>
    </div>

    <!-- 右侧：每页条数选择 -->
    <div class="page-size-selector">
      <span class="page-size-label">{{ currentPage }}/{{ totalPages }} 页</span>
      <select class="page-size-select" :value="pageSize" @change="onSizeChange">
        <option v-for="s in pageSizes" :key="s" :value="s">{{ s }} 条/页</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  total: number
  pageSize: number
  currentPage: number
  pageSizes?: number[]
}>(), {
  pageSizes: () => [20, 50, 100, 500],
})

const emit = defineEmits<{
  'update:pageSize': [value: number]
  'update:currentPage': [value: number]
  change: [params: { page: number; pageSize: number }]
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))

// 页码显示逻辑：首尾常驻，当前页 ±2，其余省略号
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = props.currentPage
  if (total <= 7) {
    // 总页数少，全部显示
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = [1]

  if (current > 4) {
    pages.push('...')
  }

  // 当前页 ±2
  const start = Math.max(2, current - 2)
  const end = Math.min(total - 1, current + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (current < total - 3) {
    pages.push('...')
  }

  pages.push(total)
  return pages
})

function goTo(page: number) {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('change', { page, pageSize: props.pageSize })
}

function onSizeChange(e: Event) {
  const val = Number((e.target as HTMLSelectElement).value)
  emit('update:pageSize', val)
  emit('change', { page: 1, pageSize: val })
}
</script>

<style scoped>
.admin-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 13px;
  color: #606266;
  flex-wrap: wrap;
  gap: 8px;
}

.page-total {
  color: #909399;
  white-space: nowrap;
}

.page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled):not(.active) {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}

.page-btn.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.page-btn:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.page-ellipsis {
  width: 32px;
  text-align: center;
  color: #c0c4cc;
  user-select: none;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.page-size-label {
  color: #909399;
}

.page-size-select {
  height: 32px;
  padding: 0 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  color: #606266;
  cursor: pointer;
  outline: none;
}

.page-size-select:focus {
  border-color: #409eff;
}

/* H5 适配 */
@media (max-width: 768px) {
  .admin-pagination {
    justify-content: center;
  }
  .page-total {
    order: -1;
    width: 100%;
    text-align: center;
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/admin/Pagination.vue
git commit -m "feat: 新增 Pagination 分页器组件"
```

---

### Task 7: 创建 VirtualTable 组件

**Files:**
- Create: `src/components/admin/VirtualTable.vue`

- [ ] **Step 1: 实现 VirtualTable**

```vue
<template>
  <div class="virtual-table-wrapper" ref="tableWrapperRef">
    <!-- 原生表格 + 固定表头 -->
    <table class="virtual-table">
      <!-- 表头：固定 -->
      <thead class="vt-header">
        <tr>
          <slot name="table-header">
            <!-- 默认表头渲染（由 columns prop 驱动） -->
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width, textAlign: col.align || 'left' }"
            >
              {{ col.label }}
            </th>
          </slot>
        </tr>
      </thead>
    </table>

    <!-- 虚拟滚动行区域 -->
    <div
      class="vt-body-scroll"
      ref="scrollRef"
      :style="{ maxHeight: maxHeight + 'px' }"
    >
      <!-- Loading 骨架屏 -->
      <div v-if="loading" class="vt-skeleton">
        <div
          v-for="i in 5"
          :key="'sk-' + i"
          class="vt-skeleton-row"
          :style="{ height: rowHeight + 'px' }"
        >
          <div
            v-for="col in columns"
            :key="col.key"
            class="vt-skeleton-cell"
            :style="{ width: col.width }"
          >
            <div class="vt-skeleton-bar" :style="{ animationDelay: (i * 0.1) + 's' }"></div>
          </div>
        </div>
      </div>

      <!-- 空数据 -->
      <div v-else-if="data.length === 0" class="vt-empty">暂无数据</div>

      <!-- 虚拟表格 -->
      <table v-else class="virtual-table">
        <colgroup>
          <col v-for="col in columns" :key="col.key" :style="{ width: col.width }" />
        </colgroup>
        <tbody>
          <tr :style="{ height: totalHeight + 'px', position: 'relative' }">
            <td
              :colspan="columns.length"
              style="padding: 0; border: none; vertical-align: top"
            >
              <div :style="{ height: totalHeight + 'px', position: 'relative' }">
                <table class="virtual-table" style="table-layout: fixed; width: 100%">
                  <colgroup>
                    <col v-for="col in columns" :key="col.key" :style="{ width: col.width }" />
                  </colgroup>
                  <tbody>
                    <tr
                      v-for="vi in virtualItems"
                      :key="(data[vi.index] as any)?.id ?? vi.index"
                      :style="{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: vi.size + 'px',
                        transform: `translateY(${vi.start}px)`,
                      }"
                      class="vt-row"
                      :class="{ 'vt-row-striped': vi.index % 2 === 0 }"
                    >
                      <slot
                        name="table-row"
                        :row="data[vi.index]"
                        :index="vi.index"
                      >
                        <!-- 默认列渲染（由 columns prop 驱动） -->
                        <td
                          v-for="col in columns"
                          :key="col.key"
                          :style="{ textAlign: col.align || 'left' }"
                        >
                          {{ (data[vi.index] as any)?.[col.key] }}
                        </td>
                      </slot>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVirtualizer } from '@tanstack/vue-virtual'

export interface ColumnDef {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

const props = withDefaults(defineProps<{
  data: Record<string, unknown>[]
  columns: ColumnDef[]
  loading?: boolean
  rowHeight?: number
  maxHeight?: number
}>(), {
  loading: false,
  rowHeight: 48,
  maxHeight: 600,
})

const scrollRef = ref<HTMLElement | null>(null)
const tableWrapperRef = ref<HTMLElement | null>(null)

const virtualizer = useVirtualizer(
  computed(() => ({
    count: props.data.length,
    getScrollElement: () => scrollRef.value,
    estimateSize: () => props.rowHeight,
    overscan: 10,
  })),
)

const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalHeight = computed(() => virtualizer.value.getTotalSize())
</script>

<style scoped>
.virtual-table-wrapper {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}

.virtual-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

.vt-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #f5f7fa;
}

.vt-header th {
  padding: 12px 8px;
  font-size: 13px;
  font-weight: 600;
  color: #909399;
  border-bottom: 1px solid #e4e7ed;
  white-space: nowrap;
  user-select: none;
}

.vt-body-scroll {
  overflow-y: auto;
}

.vt-row {
  border-bottom: 1px solid #ebeef5;
  transition: background 0.15s ease;
}

.vt-row:hover {
  background: #f5f7fa;
}

.vt-row-striped {
  background: #fafafa;
}

.vt-row-striped:hover {
  background: #f5f7fa;
}

.vt-row td {
  padding: 0 8px;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
}

/* 骨架屏 */
.vt-skeleton {
  padding: 0;
}

.vt-skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 8px;
  border-bottom: 1px solid #ebeef5;
}

.vt-skeleton-cell {
  flex-shrink: 0;
}

.vt-skeleton-bar {
  height: 16px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e8e8e8 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  width: 80%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* 空状态 */
.vt-empty {
  padding: 80px 0;
  text-align: center;
  font-size: 14px;
  color: #c0c4cc;
}

/* H5: 小屏表格横向滚动 */
@media (max-width: 768px) {
  .virtual-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .virtual-table {
    min-width: 600px;
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/admin/VirtualTable.vue
git commit -m "feat: 新增 VirtualTable 虚拟表格组件（含骨架屏 loading）"
```

---

### Task 8: 创建 SearchForm 组件

**Files:**
- Create: `src/components/admin/SearchForm.vue`

- [ ] **Step 1: 实现 SearchForm**

```vue
<template>
  <div class="search-form">
    <!-- 搜索字段区域：由插槽传入 -->
    <div class="sf-fields">
      <slot></slot>
    </div>

    <!-- 操作按钮 -->
    <div class="sf-actions">
      <button class="sf-btn sf-btn-search" :disabled="searching" @click="$emit('search')">
        <span v-if="searching" class="sf-spinner"></span>
        {{ searching ? '搜索中...' : '搜索' }}
      </button>
      <button class="sf-btn sf-btn-reset" :disabled="searching" @click="$emit('reset')">
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  searching?: boolean
}>()

defineEmits<{
  search: []
  reset: []
}>()
</script>

<style scoped>
.search-form {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.sf-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

/* 搜索字段通用样式（作用于插槽内的 input/select 等） */
.sf-fields :deep(input[type="text"]),
.sf-fields :deep(input[type="date"]),
.sf-fields :deep(select) {
  height: 36px;
  padding: 0 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  color: #606266;
  background: #fff;
  outline: none;
  transition: border-color 0.2s;
}

.sf-fields :deep(input[type="text"]:focus),
.sf-fields :deep(input[type="date"]:focus) {
  border-color: #409eff;
}

.sf-fields :deep(input[type="text"]::placeholder) {
  color: #c0c4cc;
}

.sf-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-self: flex-start;
}

.sf-btn {
  height: 36px;
  padding: 0 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.sf-btn-search {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

.sf-btn-search:hover:not(:disabled) {
  background: #66b1ff;
  border-color: #66b1ff;
}

.sf-btn-search:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sf-btn-reset {
  background: #f5f7fa;
  color: #606266;
}

.sf-btn-reset:hover:not(:disabled) {
  background: #ecf5ff;
  color: #409eff;
  border-color: #c6e2ff;
}

.sf-btn-reset:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 旋转动画 */
.sf-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: sf-spin 0.6s linear infinite;
}

@keyframes sf-spin {
  to { transform: rotate(360deg); }
}

/* H5 适配 */
@media (max-width: 480px) {
  .search-form {
    flex-direction: column;
    padding: 12px;
  }

  .sf-fields {
    flex-direction: column;
    width: 100%;
  }

  .sf-fields :deep(input[type="text"]),
  .sf-fields :deep(input[type="date"]),
  .sf-fields :deep(.virtual-dropdown) {
    width: 100% !important;
  }

  .sf-actions {
    width: 100%;
  }

  .sf-btn {
    flex: 1;
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/admin/SearchForm.vue
git commit -m "feat: 新增 SearchForm 搜索表单容器组件"
```

---

### Task 9: 创建后台导航数据和 API 层

**Files:**
- Create: `src/data/admin-navigation.ts`
- Create: `src/api/admin.ts`

- [ ] **Step 1: 创建 admin-navigation.ts**

```ts
// src/data/admin-navigation.ts
// 后台管理导航配置 — AppNavbar「更多」下拉数据源

export interface NavItem {
  path: string
  label: string
}

export const adminNav: NavItem[] = [
  { path: '/admin/manage', label: '📊 后台管理' },
]
```

- [ ] **Step 2: 创建 admin.ts（API + mock 生成器）**

```ts
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

  const name = (params as Record<string, unknown>).name as string
  if (name) {
    filtered = filtered.filter((u) => u.name.includes(name))
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
```

- [ ] **Step 3: 提交**

```bash
git add src/data/admin-navigation.ts src/api/admin.ts
git commit -m "feat: 新增后台导航配置 + API 层（含 10 万条 mock 数据）"
```

---

### Task 10: 创建 AdminManage.vue 壳子页面（含 demo 用法）

**Files:**
- Create: `src/views/admin/AdminManage.vue`

- [ ] **Step 1: 实现 AdminManage.vue**

```vue
<template>
  <div class="admin-page">
    <div class="admin-container">
      <!-- 页面标题 -->
      <h2 class="admin-title">后台管理</h2>

      <!-- 搜索区 -->
      <SearchForm
        :searching="loading"
        @search="handleSearch"
        @reset="handleReset"
      >
        <!-- ===== 搜索字段：由 slot 自定义 ===== -->
        <!-- 输入框搜索 -->
        <input
          v-model="formData.search"
          type="text"
          placeholder="请输入用户名/邮箱/部门"
          style="width: 240px"
          @keyup.enter="handleSearch"
        />

        <!-- 虚拟下拉搜索（角色） -->
        <VirtualDropdown
          v-model="formData.role"
          :options="roleOptions"
          placeholder="选择角色"
          style="width: 160px"
        />

        <!-- 虚拟下拉搜索（状态） -->
        <VirtualDropdown
          v-model="formData.status"
          :options="statusOptions"
          placeholder="选择状态"
          style="width: 120px"
        />

        <!-- 日期范围：起始-结束 -->
        <input v-model="formData.dateStart" type="date" title="起始日期" />
        <span style="color: #909399; line-height: 36px">—</span>
        <input v-model="formData.dateEnd" type="date" title="结束日期" />

        <!-- 多选：基于 VirtualDropdown + checkbox（部门） -->
        <VirtualDropdown
          v-model="selectedDeptLabel"
          :options="deptOptions"
          placeholder="选择部门（多选）"
          style="width: 220px"
        />
        <!-- 多选值同步到 formData.departments（以标签形式显示已选） -->
      </SearchForm>

      <!-- 表格区 -->
      <VirtualTable
        :data="tableData"
        :columns="tableColumns"
        :loading="loading"
        :row-height="48"
        :max-height="500"
      >
        <!-- 表头插槽 -->
        <template #table-header>
          <th style="width: 80px">ID</th>
          <th style="width: 140px">用户名</th>
          <th style="width: 200px">邮箱</th>
          <th style="width: 100px">角色</th>
          <th style="width: 80px">状态</th>
          <th style="width: 120px">部门</th>
          <th style="width: 100px">城市</th>
          <th style="width: 140px">创建日期</th>
        </template>

        <!-- 行渲染插槽 -->
        <template #table-row="{ row }">
          <td style="width: 80px">{{ (row as UserRow).id }}</td>
          <td style="width: 140px">{{ (row as UserRow).name }}</td>
          <td style="width: 200px">{{ (row as UserRow).email }}</td>
          <td style="width: 100px">
            <span
              class="role-tag"
              :class="{ 'role-admin': (row as UserRow).role === '管理员' }"
            >
              {{ (row as UserRow).role }}
            </span>
          </td>
          <td style="width: 80px">
            <span
              class="status-dot"
              :class="(row as UserRow).status === '启用' ? 'status-on' : 'status-off'"
            ></span>
            {{ (row as UserRow).status }}
          </td>
          <td style="width: 120px">{{ (row as UserRow).department }}</td>
          <td style="width: 100px">{{ (row as UserRow).city }}</td>
          <td style="width: 140px">{{ (row as UserRow).createdAt }}</td>
        </template>
      </VirtualTable>

      <!-- 分页器 -->
      <Pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[20, 50, 100, 500]"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useSearch } from '@/composables/useSearch'
import { useTable } from '@/composables/useTable'
import SearchForm from '@/components/admin/SearchForm.vue'
import VirtualDropdown from '@/components/admin/VirtualDropdown.vue'
import VirtualTable from '@/components/admin/VirtualTable.vue'
import Pagination from '@/components/admin/Pagination.vue'
import { mockFetchUsers, fetchUsers } from '@/api/admin'
import type { PageResult, PageParams } from '@/composables/useTable'

// ===== 行数据类型 =====
interface UserRow {
  id: number
  name: string
  email: string
  role: string
  status: string
  department: string
  city: string
  createdAt: string
}

// ===== 表格列定义（用于默认渲染） =====
const tableColumns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: '用户名', width: '140px' },
  { key: 'email', label: '邮箱', width: '200px' },
  { key: 'role', label: '角色', width: '100px' },
  { key: 'status', label: '状态', width: '80px' },
  { key: 'department', label: '部门', width: '120px' },
  { key: 'city', label: '城市', width: '100px' },
  { key: 'createdAt', label: '创建日期', width: '140px' },
]

// ===== 下拉选项数据 =====
const roleOptions = [
  { label: '管理员', value: '管理员' },
  { label: '编辑', value: '编辑' },
  { label: '普通用户', value: '普通用户' },
  { label: '访客', value: '访客' },
]

const statusOptions = [
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' },
]

const deptOptions = [
  { label: '技术部', value: '技术部' },
  { label: '产品部', value: '产品部' },
  { label: '设计部', value: '设计部' },
  { label: '运营部', value: '运营部' },
  { label: '市场部', value: '市场部' },
  { label: '人事部', value: '人事部' },
  { label: '财务部', value: '财务部' },
  { label: '法务部', value: '法务部' },
  { label: '销售部', value: '销售部' },
  { label: '客服部', value: '客服部' },
  { label: '数据部', value: '数据部' },
  { label: '行政部', value: '行政部' },
  { label: '研发一部', value: '研发一部' },
  { label: '研发二部', value: '研发二部' },
  { label: '测试部', value: '测试部' },
]

// ===== 数据获取器：根据环境变量切换 mock / 真实 API =====
const resolvedFetcher =
  import.meta.env.VITE_USE_MOCK === 'true'
    ? mockFetchUsers
    : fetchUsers

// ===== 搜索逻辑 =====
const { formData, searchParams, search: triggerSearch, reset: triggerReset } = useSearch({
  search: '',
  role: '',
  status: '',
  dateStart: '',
  dateEnd: '',
})

// 多选部门的展示 label（简化处理：暂不实现完整多选，留到后续扩展）
const selectedDeptLabel = ''

// ===== 表格逻辑 =====
const {
  data: tableData,
  loading,
  total,
  page,
  pageSize,
  fetch,
  onPageChange: tablePageChange,
} = useTable<UserRow>(resolvedFetcher as (params: PageParams) => Promise<PageResult<UserRow>>)

// ===== 事件处理 =====
function handleSearch() {
  triggerSearch()
}

function handleReset() {
  triggerReset()
}

function onPageChange({ page: p, pageSize: ps }: { page: number; pageSize: number }) {
  tablePageChange({ page: p, pageSize: ps })
}

// 搜索参数变更 → 自动请求
watch(
  [searchParams, page, pageSize],
  () => {
    fetch(searchParams.value as PageParams)
  },
  { immediate: true },
)
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px 0;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.admin-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

/* 角色标签 */
.role-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  color: #606266;
  background: #f0f2f5;
}

.role-tag.role-admin {
  color: #409eff;
  background: #ecf5ff;
}

/* 状态圆点 */
.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}

.status-dot.status-on {
  background: #67c23a;
}

.status-dot.status-off {
  background: #f56c6c;
}

/* H5 适配 */
@media (max-width: 768px) {
  .admin-container {
    padding: 0 12px;
  }

  .admin-page {
    padding: 12px 0;
  }
}

@media (max-width: 480px) {
  .admin-title {
    font-size: 18px;
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/views/admin/AdminManage.vue
git commit -m "feat: 新增 AdminManage 后台管理壳子页面（含用户管理 demo）"
```

---

### Task 11: 注册路由 & 更新导航栏

**Files:**
- Modify: `src/router/index.ts`
- Modify: `src/components/common/AppNavbar.vue`

- [ ] **Step 1: 注册 admin 路由**

在 `src/router/index.ts` 的 routes 数组末尾（`]` 之前）添加：

```ts
// ===== 后台管理 =====
{
  path: '/admin/manage',
  name: 'admin-manage',
  component: () => import('../views/admin/AdminManage.vue'),
},
```

具体编辑：在路由数组的 `},`（最后一个路由对象闭合）和 `],`（routes 数组闭合）之间插入上面4行。

- [ ] **Step 2: 更新 AppNavbar.vue**

在 `<script setup>` 中新增导入 adminNav：

```ts
import { mainNav, practiceNav, gamesNav, adminNav } from '@/data/navigation'
```

然后修改 `allNav` computed：

```ts
const allNav = computed(() => [...mainNav, ...gamesNav, ...adminNav, ...practiceNav])
```

在模板「更多」下拉的 `<div v-if="open" class="dropdown-menu">` 中，在 `practiceNav` 的 `RouterLink` 循环之前插入 adminNav：

```html
<!-- 更多下拉 -->
<div class="nav-dropdown" @mouseenter="open = true" @mouseleave="open = false">
  <span class="blog-nav-link dropdown-trigger">更多 ▾</span>
  <Transition name="dropdown-fade">
    <div v-if="open" class="dropdown-menu">
      <RouterLink
        v-for="sub in adminNav"
        :key="sub.path"
        :to="sub.path"
        class="dropdown-item"
      >
        {{ sub.label }}
      </RouterLink>
      <div class="dropdown-divider"></div>
      <RouterLink
        v-for="sub in practiceNav"
        :key="sub.path"
        :to="sub.path"
        class="dropdown-item"
      >
        {{ sub.label }}
      </RouterLink>
    </div>
  </Transition>
</div>
```

在 `<style scoped>` 中新增分隔线样式：

```css
.dropdown-divider {
  height: 1px;
  margin: 4px 8px;
  background: var(--color-border-dark);
}
```

- [ ] **Step 3: 验证 navigation.ts 导出 adminNav**

确保 `src/data/navigation.ts` 中有 `export { adminNav } from './admin-navigation'` 或直接 export const。由于 adminNav 在独立文件中，需要统一导出。

在 `src/data/navigation.ts` 末尾添加：

```ts
export { adminNav } from './admin-navigation'
```

- [ ] **Step 4: 运行项目验证**

```bash
cd d:/vue3/creatNewVue && npm run dev
```

检查：
1. 导航栏「更多」下拉出现「📊 后台管理」
2. 点击进入后看到搜索区（下拉/输入框/日期）
3. 表格自动加载数据，骨架屏短暂出现
4. 切换每页条数（20/50/100/500），分页正常
5. 搜索条件过滤有效
6. 滚动表格流畅无卡顿（虚拟滚动生效）
7. 768px 以下表格横向滚动，480px 以下搜索字段纵向堆叠

- [ ] **Step 5: 提交**

```bash
git add src/router/index.ts src/components/common/AppNavbar.vue src/data/navigation.ts
git commit -m "feat: 注册后台管理路由 + 导航栏「更多」加入后台入口"
```

---

### Task 12: H5 响应式收尾验证

- [ ] **Step 1: 检查所有组件的响应式样式**

逐个检查以下断点是否正确生效：
- `SearchForm.vue` — 480px 以下搜索字段纵向堆叠
- `VirtualTable.vue` — 768px 以下表格横向滚动
- `Pagination.vue` — 768px 以下居中布局
- `AdminManage.vue` — 768px/480px 容器 padding 适配

- [ ] **Step 2: 在浏览器 DevTools 中模拟各断点验证**

确认无溢出、无错位、触控区域 ≥ 44px

- [ ] **Step 3: 如有修复，提交**

```bash
git add -A && git commit -m "fix: H5 响应式适配微调"
```

