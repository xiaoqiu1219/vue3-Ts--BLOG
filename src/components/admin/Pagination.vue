<template>
  <div class="admin-pagination">
    <!-- 左侧：总条数 -->
    <span class="page-total">共 {{ total }} 条</span>

    <!-- 中间：页码 -->
    <div class="page-numbers">
      <button class="page-btn" :disabled="currentPage === 1" @click="goTo(1)" aria-label="首页">«</button>
      <button class="page-btn" :disabled="currentPage === 1" @click="goTo(currentPage - 1)" aria-label="上一页">‹</button>

      <template v-for="p in displayedPages" :key="p">
        <span v-if="p === '...'" class="page-ellipsis">...</span>
        <button v-else class="page-btn" :class="{ active: p === currentPage }" @click="goTo(p as number)">{{ p }}</button>
      </template>

      <button class="page-btn" :disabled="currentPage >= totalPages" @click="goTo(currentPage + 1)" aria-label="下一页">›</button>
      <button class="page-btn" :disabled="currentPage >= totalPages" @click="goTo(totalPages)" aria-label="末页">»</button>
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

// 页码显示逻辑：首尾常驻，当前页 ±2，其余用省略号
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = props.currentPage
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | string)[] = [1]
  if (current > 4) pages.push('...')
  const start = Math.max(2, current - 2)
  const end = Math.min(total - 1, current + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 3) pages.push('...')
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

.page-total { color: #909399; white-space: nowrap; }

.page-numbers { display: flex; align-items: center; gap: 4px; }

.page-btn {
  min-width: 32px; height: 32px; padding: 0 6px;
  border: 1px solid #dcdfe6; border-radius: 4px;
  background: #fff; font-size: 13px; color: #606266;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s ease;
}

.page-btn:hover:not(:disabled):not(.active) { color: #409eff; border-color: #c6e2ff; background: #ecf5ff; }
.page-btn.active { background: #409eff; color: #fff; border-color: #409eff; }
.page-btn:disabled { color: #c0c4cc; cursor: not-allowed; }

.page-ellipsis { width: 32px; text-align: center; color: #c0c4cc; user-select: none; }

.page-size-selector { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.page-size-label { color: #909399; }

.page-size-select {
  height: 32px; padding: 0 8px; border: 1px solid #dcdfe6; border-radius: 4px;
  background: #fff; font-size: 13px; color: #606266; cursor: pointer; outline: none;
}
.page-size-select:focus { border-color: #409eff; }

/* H5 */
@media (max-width: 768px) {
  .admin-pagination { justify-content: center; }
  .page-total { order: -1; width: 100%; text-align: center; }
}
</style>
