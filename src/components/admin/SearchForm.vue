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

/* 搜索字段通用样式 */
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

/* H5 */
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
