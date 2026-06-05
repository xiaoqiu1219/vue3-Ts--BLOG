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
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
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
const highlightIndex = ref(-1)

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
    highlightIndex.value = -1
    nextTick(() => searchInputRef.value?.focus())
  }
}

function select(option: SelectOption) {
  emit('update:modelValue', option.value)
  open.value = false
  filterText.value = ''
  highlightIndex.value = -1
}

// 点击外部关闭
function onClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    open.value = false
    filterText.value = ''
  }
}

// 键盘导航
function onTriggerKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggle()
  } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    if (!open.value) toggle()
  }
}

function onListKeydown(e: KeyboardEvent) {
  const len = filteredOptions.value.length
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightIndex.value = Math.min(highlightIndex.value + 1, len - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightIndex.value = Math.max(highlightIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (highlightIndex.value >= 0 && highlightIndex.value < len) {
      select(filteredOptions.value[highlightIndex.value])
    }
  } else if (e.key === 'Escape') {
    open.value = false
    filterText.value = ''
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.virtual-dropdown {
  position: relative;
  display: inline-block;
}

.vd-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 var(--space-3, 12px);
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: border-color 0.2s;
  user-select: none;
  min-width: 120px;
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

.vd-trigger-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vd-trigger-text.placeholder {
  color: #c0c4cc;
}

.vd-arrow {
  font-size: 12px;
  color: #c0c4cc;
  transition: transform 0.2s;
  flex-shrink: 0;
  margin-left: 8px;
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
  z-index: var(--z-dropdown, 10);
  overflow: hidden;
  min-width: 100%;
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
  box-sizing: border-box;
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
  box-sizing: border-box;
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
