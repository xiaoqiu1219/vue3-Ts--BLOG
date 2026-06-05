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
  const error = ref<string | null>(null)
  const loading = ref(false)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(20)

  // 获取数据：loading = true → 请求 → loading = false
  async function fetch(params: PageParams) {
    loading.value = true
    error.value = null
    try {
      const result = await fetcher({
        page: page.value,
        pageSize: pageSize.value,
        ...params,
      })
      data.value = result.data
      total.value = result.total
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '请求失败'
      data.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  // 分页变更：更新页码/条数（由外部 watcher 触发 fetch）
  async function onPageChange({ page: p, pageSize: ps }: { page: number; pageSize: number }) {
    // pageSize 变化时回到第一页
    if (ps !== pageSize.value) {
      page.value = 1
    } else {
      page.value = p
    }
    pageSize.value = ps
  }

  // 刷新当前页（如删除/编辑后重新加载）
  async function refresh() {
    await fetch({ page: page.value, pageSize: pageSize.value })
  }

  return { data, loading, error, total, page, pageSize, fetch, onPageChange, refresh }
}
