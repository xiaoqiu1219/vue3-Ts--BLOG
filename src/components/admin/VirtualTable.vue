<template>
  <div class="virtual-table-wrapper" ref="tableWrapperRef">
    <!-- 固定表头 -->
    <table class="virtual-table">
      <thead class="vt-header">
        <tr>
          <slot name="table-header">
            <th v-for="col in columns" :key="col.key" :style="{ width: col.width, textAlign: col.align || 'left' }">
              {{ col.label }}
            </th>
          </slot>
        </tr>
      </thead>
    </table>

    <!-- 滚动体 -->
    <div class="vt-body-scroll" ref="scrollRef" :style="{ maxHeight: maxHeight + 'px' }">
      <!-- Loading 骨架屏 -->
      <div v-if="loading" class="vt-skeleton">
        <div v-for="i in 5" :key="'sk-' + i" class="vt-skeleton-row" :style="{ height: rowHeight + 'px' }">
          <div v-for="col in columns" :key="col.key" class="vt-skeleton-cell" :style="{ width: col.width }">
            <div class="vt-skeleton-bar" :style="{ animationDelay: (i * 0.1) + 's' }"></div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else-if="data.length === 0" class="vt-empty">暂无数据</div>

      <!-- 虚拟表格 -->
      <table v-else class="virtual-table">
        <colgroup>
          <col v-for="col in columns" :key="col.key" :style="{ width: col.width }" />
        </colgroup>
        <tbody>
          <tr :style="{ height: totalHeight + 'px', position: 'relative' }">
            <td :colspan="columns.length" style="padding: 0; border: none; vertical-align: top">
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
                        top: 0, left: 0, width: '100%',
                        height: vi.size + 'px',
                        transform: `translateY(${vi.start}px)`,
                      }"
                      class="vt-row"
                      :class="{ 'vt-row-striped': vi.index % 2 === 0 }"
                    >
                      <slot name="table-row" :row="data[vi.index]" :index="vi.index">
                        <td v-for="col in columns" :key="col.key" :style="{ textAlign: col.align || 'left' }">
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

.vt-row td, .virtual-table td {
  padding: 0 8px;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1;
}

/* 骨架屏 */
.vt-skeleton { padding: 0; }
.vt-skeleton-row { display: flex; align-items: center; gap: 16px; padding: 0 8px; border-bottom: 1px solid #ebeef5; }
.vt-skeleton-cell { flex-shrink: 0; }

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

/* H5 */
@media (max-width: 768px) {
  .virtual-table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .virtual-table { min-width: 600px; }
}
</style>
