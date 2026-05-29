<template>
  <!--
    Teleport: 将弹窗渲染到 body 元素下
    这样弹窗可以独立于父组件的样式和布局，避免被 overflow:hidden 等样式影响
  -->
  <Teleport to="body">
    <!-- 外层过渡动画：控制遮罩层的淡入淡出 -->
    <Transition name="modal-fade">
      <!--
        modal-overlay: 遮罩层
        - 半透明黑色背景
        - 点击时根据 closeOnClickModal 配置决定是否关闭
        - z-index 控制层级
      -->
      <div
        v-if="visible"
        class="modal-overlay"
        :style="{ zIndex: modalZIndex }"
        @click="handleMaskClick"
      >
        <!-- 内层过渡动画：控制弹窗内容的缩放效果 -->
        <Transition name="modal-zoom">
          <!--
            modal-container: 弹窗主体容器
            - 支持自定义类名和样式
            - 点击事件阻止冒泡，避免触发遮罩层关闭
          -->
          <div
            v-if="visible"
            class="modal-container"
            :class="options?.customClass"
            :style="{
              width: modalWidth,
              ...options?.customStyle
            }"
            @click="stopPropagation"
          >
            <!-- ==================== 头部区域 ==================== -->
            <div class="modal-header">
              <!-- 支持自定义头部插槽 -->
              <slot name="header">
                <span class="modal-title">{{ modalTitle }}</span>
              </slot>
              <!-- 关闭按钮：根据 showClose 配置显示/隐藏 -->
              <button
                v-if="isShowClose"
                class="modal-close-btn"
                @click="handleClose"
                aria-label="关闭"
              >
                <!-- SVG 关闭图标 -->
                <svg viewBox="0 0 24 24" class="modal-close-icon">
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
                  />
                </svg>
              </button>
            </div>

            <!-- ==================== 内容区域 ==================== -->
            <div class="modal-body">
              <!--
                内容渲染优先级：
                1. 默认插槽内容（推荐用法：<Modal>内容</Modal>）
                2. options.content 是对象（VNode），使用动态组件渲染
                3. options.content 是字符串，使用 v-html 渲染 HTML
              -->
              <slot v-if="hasSlotContent"></slot>
              <component
                v-else-if="options?.content && typeof options.content === 'object'"
                :is="options.content"
              />
              <div v-else-if="options?.content" v-html="options.content"></div>
            </div>

            <!-- ==================== 底部按钮区域 ==================== -->
            <div class="modal-footer">
              <!-- 支持自定义底部插槽 -->
              <slot name="footer">
                <!-- 取消按钮：根据 showCancel 配置显示/隐藏 -->
                <button
                  v-if="isShowCancel"
                  class="modal-btn modal-btn-cancel"
                  @click="handleCancel"
                >
                  {{ cancelText }}
                </button>
                <!-- 确认按钮：根据 showConfirm 配置显示/隐藏 -->
                <button
                  v-if="isShowConfirm"
                  class="modal-btn modal-btn-confirm"
                  @click="handleConfirm"
                >
                  {{ confirmText }}
                </button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * Modal 弹窗组件
 *
 * 功能特性：
 * - 通过 Teleport 将弹窗挂载到 body，独立于当前 Vue 组件树
 * - 支持遮罩层点击关闭
 * - 支持自定义宽度、层级、按钮文字等配置
 * - 内容支持插槽、字符串（HTML）和 VNode 两种形式
 * - 内置淡入淡出和缩放过渡动画
 * - 支持 v-model 双向绑定控制显示/隐藏
 */
import { computed, ref, useSlots, watch } from 'vue'
import type { ModalOptions } from './types'

defineOptions({ name: 'VueModal' })

// ==================== Props 定义 ====================
/**
 * @property options - Modal 配置选项（可选，用于函数式调用兼容）
 * @property modelValue - 控制弹窗显示/隐藏，支持 v-model
 * @property title - 弹窗标题
 * @property width - 弹窗宽度
 * @property zIndex - 弹窗层级
 * @property confirmText - 确认按钮文字
 * @property cancelText - 取消按钮文字
 * @property showConfirm - 是否显示确认按钮
 * @property showCancel - 是否显示取消按钮
 * @property showClose - 是否显示关闭按钮
 * @property closeOnClickModal - 点击遮罩层是否关闭
 */
const props = withDefaults(
  defineProps<{
    options?: ModalOptions
    modelValue?: boolean
    title?: string
    width?: string | number
    zIndex?: number
    confirmText?: string
    cancelText?: string
    showConfirm?: boolean
    showCancel?: boolean
    showClose?: boolean
    closeOnClickModal?: boolean
  }>(),
  {
    modelValue: undefined,
    title: '',
    width: undefined,
    zIndex: undefined,
    confirmText: '确定',
    cancelText: '取消',
    showConfirm: true,
    showCancel: true,
    showClose: true,
    closeOnClickModal: true
  }
)

// ==================== Emits 定义 ====================
/**
 * @event update:modelValue - v-model 更新事件
 * @event confirm - 点击确认按钮时触发
 * @event cancel - 点击取消按钮时触发
 * @event close - 关闭弹窗时触发（包括点击关闭按钮、遮罩层关闭）
 * @event open - 弹窗打开时触发
 */
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
  close: []
  open: []
}>()

// ==================== 插槽 ====================
/** 获取插槽，用于判断是否有默认插槽内容 */
const slots = useSlots()

// ==================== 响应式状态 ====================
/** 控制弹窗显示/隐藏（内部状态，用于非 v-model 模式） */
const internalVisible = ref(false)

/** 计算实际显示状态：优先使用 v-model，否则使用内部状态 */
const visible = computed({
  get: () => (props.modelValue !== undefined ? props.modelValue : internalVisible.value),
  set: (val) => {
    if (props.modelValue !== undefined) {
      emit('update:modelValue', val)
    } else {
      internalVisible.value = val
    }
  }
})

// ==================== 计算属性 ====================
/**
 * 计算弹窗宽度
 * @description 优先使用 props.width，其次 options.width，默认 480px
 */
const modalWidth = computed(() => {
  const width = props.width ?? props.options?.width
  if (!width) return '480px'
  return typeof width === 'number' ? `${width}px` : width
})

/**
 * 计算弹窗层级
 * @description 优先使用 props.zIndex，其次 options.zIndex，默认 2000
 */
const modalZIndex = computed(() => {
  return props.zIndex ?? props.options?.zIndex ?? 2000
})

/** 计算标题 */
const modalTitle = computed(() => props.title || props.options?.title || '提示')

/** 是否显示确认按钮 */
const isShowConfirm = computed(() => props.showConfirm && props.options?.showConfirm !== false)

/** 是否显示取消按钮 */
const isShowCancel = computed(() => props.showCancel && props.options?.showCancel !== false)

/** 是否显示关闭按钮 */
const isShowClose = computed(() => props.showClose && props.options?.showClose !== false)

/** 点击遮罩层是否关闭 */
const isCloseOnClickModal = computed(
  () => props.closeOnClickModal && props.options?.closeOnClickModal !== false
)

/** 是否有插槽内容 */
const hasSlotContent = computed(() => !!slots.default)

// ==================== 事件处理函数 ====================
/** 确认按钮点击处理 */
const handleConfirm = () => {
  emit('confirm')
}

/** 取消按钮点击处理 */
const handleCancel = () => {
  emit('cancel')
  visible.value = false
}

/** 关闭按钮点击处理 */
const handleClose = () => {
  emit('close')
  visible.value = false
}

/**
 * 遮罩层点击处理
 * @description 根据 closeOnClickModal 配置决定是否关闭弹窗
 */
const handleMaskClick = () => {
  if (isCloseOnClickModal.value) {
    handleClose()
  }
}

/**
 * 阻止事件冒泡
 * @description 防止点击弹窗内容区域时触发遮罩层的关闭事件
 */
const stopPropagation = (e: Event) => {
  e.stopPropagation()
}

// ==================== 监听器 ====================
/**
 * 监听 visible 变化
 * @description 控制页面滚动锁定，防止背景页面滚动
 */
watch(visible, (val) => {
  if (val) {
    // 弹窗打开时，禁止 body 滚动
    document.body.style.overflow = 'hidden'
    // 触发打开事件和回调
    emit('open')
    props.options?.onOpen?.()
  } else {
    // 弹窗关闭时，恢复 body 滚动
    document.body.style.overflow = ''
  }
})

// ==================== 对外暴露方法 ====================
/**
 * 暴露给父组件调用的方法
 * @method open - 打开弹窗
 * @method close - 关闭弹窗
 */
defineExpose({
  open: () => {
    visible.value = true
  },
  close: () => {
    visible.value = false
  }
})
</script>

<style scoped>
/* ==================== 遮罩层样式 ==================== */
/**
 * .modal-overlay - 遮罩层
 * - 固定定位，覆盖整个视口
 * - 半透明黑色背景
 * - 使用 flex 居中弹窗内容
 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==================== 弹窗容器样式 ==================== */
/**
 * .modal-container - 弹窗主体
 * - 白色背景、圆角、阴影
 * - 最大宽高限制，防止溢出视口
 * - flex 布局，方便头部/内容/底部三区域划分
 */
.modal-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

/* ==================== 头部样式 ==================== */
/**
 * .modal-header - 头部区域
 * - 左侧显示标题，右侧显示关闭按钮
 * - 底部边框分隔
 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

/**
 * .modal-close-btn - 关闭按钮
 * - 透明背景，hover 时显示背景
 * - 包含 SVG 图标
 */
.modal-close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.modal-close-btn:hover {
  background-color: #f5f5f5;
}

.modal-close-icon {
  width: 18px;
  height: 18px;
  fill: #999;
}

/* ==================== 内容区域样式 ==================== */
/**
 * .modal-body - 内容区域
 * - flex: 1 占据剩余空间
 * - 内容超出时垂直滚动
 */
.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

/* ==================== 底部按钮区域样式 ==================== */
/**
 * .modal-footer - 底部区域
 * - 按钮右对齐，间隔排列
 * - 顶部边框分隔
 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid #e8e8e8;
}

/**
 * .modal-btn - 按钮通用样式
 */
.modal-btn {
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

/**
 * .modal-btn-cancel - 取消按钮
 * - 白色背景，灰色边框
 * - hover 时边框变蓝
 */
.modal-btn-cancel {
  background: #fff;
  border-color: #d9d9d9;
  color: #666;
}

.modal-btn-cancel:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

/**
 * .modal-btn-confirm - 确认按钮
 * - 蓝色背景
 * - hover 时颜色变浅
 */
.modal-btn-confirm {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.modal-btn-confirm:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

/* ==================== 过渡动画 ==================== */
/**
 * modal-fade - 遮罩层淡入淡出动画
 * 打开时：opacity 0 -> 1，耗时 0.25s
 * 关闭时：opacity 1 -> 0，耗时 0.2s（稍快，更干脆）
 */
.modal-fade-enter-active {
  transition: opacity 0.25s ease-out;
}

.modal-fade-leave-active {
  transition: opacity 0.2s ease-in;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/**
 * modal-zoom - 弹窗内容动画
 * 打开时：从下方滑入 + 缩放 + 淡入，有弹性效果
 * 关闭时：向上滑出 + 缩放 + 淡出
 */
.modal-zoom-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-zoom-leave-active {
  transition: all 0.2s ease-in;
}

.modal-zoom-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.modal-zoom-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>