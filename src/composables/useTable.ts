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
