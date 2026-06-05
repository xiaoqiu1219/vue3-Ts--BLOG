// src/composables/useVirtualScroll.ts
// 虚拟滚动封装 — 基于 @tanstack/vue-virtual 提供统一的行虚拟化 hook
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, type Ref } from 'vue'

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
