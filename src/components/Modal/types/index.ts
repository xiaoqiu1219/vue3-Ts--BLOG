import type { VNode } from 'vue'

export type ModalContentType = string | VNode

export interface ModalOptions {
  /** 弹窗标题 */
  title?: string
  /** 弹窗内容，支持字符串或 VNode */
  content?: ModalContentType
  /** 确认按钮文字 */
  confirmText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 是否显示确认按钮 */
  showConfirm?: boolean
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 点击遮罩层是否关闭 */
  closeOnClickModal?: boolean
  /** 是否显示关闭图标 */
  showClose?: boolean
  /** 自定义类名 */
  customClass?: string
  /** 自定义样式 */
  customStyle?: Record<string, string>
  /** 弹窗宽度 */
  width?: string | number
  /** 弹窗层级 */
  zIndex?: number
  /** 确认回调 */
  onConfirm?: () => void | Promise<void>
  /** 取消回调 */
  onCancel?: () => void
  /** 关闭回调 */
  onClose?: () => void
  /** 打开后的回调 */
  onOpen?: () => void
}

export interface ModalInstance {
  id: string
  options: ModalOptions
  resolve: (value: boolean) => void
  reject: (reason?: unknown) => void
}

export interface ModalConfig {
  /** 全局确认按钮文字 */
  confirmText?: string
  /** 全局取消按钮文字 */
  cancelText?: string
  /** 全局点击遮罩层是否关闭 */
  closeOnClickModal?: boolean
  /** 全局是否显示关闭图标 */
  showClose?: boolean
  /** 全局弹窗宽度 */
  width?: string | number
  /** 全局弹窗层级 */
  zIndex?: number
  /** 自定义类名 */
  customClass?: string
}

export interface ModalI18n {
  confirm?: string
  cancel?: string
}

export type ModalPluginOptions = ModalConfig & {
  i18n?: ModalI18n
}