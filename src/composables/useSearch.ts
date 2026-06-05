// src/composables/useSearch.ts
// 后台管理通用搜索逻辑 — 管理搜索表单数据、搜索触发和重置
import { reactive, ref } from 'vue'

export interface SearchParams {
  [key: string]: unknown
}

/**
 * 搜索表单状态管理
 * @param initialValues — 初始值，类型 T 由调用方推断，保留具体属性类型给 v-model 使用
 */
export function useSearch<T extends Record<string, unknown>>(initialValues: T) {
  // 表单当前值（搜索字段通过 v-model 绑定）
  const formData = reactive<T>({ ...initialValues })

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
