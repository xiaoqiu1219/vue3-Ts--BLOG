import { createApp, h, ref } from 'vue'
import Modal from './Modal.vue'
import { i18n } from '@/i18n'
import type { ModalOptions, ModalConfig, ModalI18n, ModalContentType } from './types'

let modalId = 0

// 全局配置（按钮文字不设默认值，未配置时由 Modal.vue 回退到 vue-i18n）
const globalConfig = ref<ModalConfig>({
  closeOnClickModal: true,
  showClose: true,
  width: '480px',
  zIndex: 2000
})

// 旧版国际化配置（modal.setI18n）：优先级高于 globalConfig，未配置时继续回退到 vue-i18n
const globalI18n = ref<ModalI18n>({})

// 合并配置
function mergeOptions(options: ModalOptions): ModalOptions {
  // 注意不要命名为 i18n，会遮蔽顶部导入的全局 i18n 单例
  const i18nConfig = globalI18n.value
  const config = globalConfig.value

  return {
    title: options.title,
    content: options.content,
    confirmText: options.confirmText ?? i18nConfig.confirm ?? config.confirmText,
    cancelText: options.cancelText ?? i18nConfig.cancel ?? config.cancelText,
    showConfirm: options.showConfirm ?? true,
    showCancel: options.showCancel ?? true,
    closeOnClickModal: options.closeOnClickModal ?? config.closeOnClickModal,
    showClose: options.showClose ?? config.showClose,
    customClass: options.customClass ?? config.customClass,
    customStyle: options.customStyle,
    width: options.width ?? config.width,
    zIndex: options.zIndex ?? config.zIndex,
    onConfirm: options.onConfirm,
    onCancel: options.onCancel,
    onClose: options.onClose,
    onOpen: options.onOpen
  }
}

// Modal 实例管理
interface ModalApp {
  id: number
  app: ReturnType<typeof createApp>
  container: HTMLDivElement
  modalComponent: InstanceType<typeof Modal>
}

const modalInstances = new Map<number, ModalApp>()

function createModal(options: ModalOptions): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const id = modalId++
    const mergedOptions = mergeOptions(options)

    // 创建容器
    const container = document.createElement('div')
    document.body.appendChild(container)

    // 创建 Vue 应用实例
    const app = createApp({
      render() {
        return h(Modal, {
          options: mergedOptions,
          onConfirm: async () => {
            try {
              if (mergedOptions.onConfirm) {
                await mergedOptions.onConfirm()
              }
              resolve(true)
              closeModal(id)
            } catch (error) {
              reject(error)
            }
          },
          onCancel: () => {
            mergedOptions.onCancel?.()
            resolve(false)
            closeModal(id)
          },
          onClose: () => {
            mergedOptions.onClose?.()
            resolve(false)
            closeModal(id)
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref: (el: any) => {
            if (el) {
              el.open()
            }
          }
        })
      }
    })

    // 挂载
    const instance = app.mount(container)

    // 获取 Modal 组件实例
    const modalComponent = instance.$refs?.modal as InstanceType<typeof Modal>

    // 存储实例
    modalInstances.set(id, {
      id,
      app,
      container,
      modalComponent
    })
  })
}

function closeModal(id: number) {
  const instance = modalInstances.get(id)
  if (instance) {
    // 关闭动画后移除
    setTimeout(() => {
      instance.app.unmount()
      document.body.removeChild(instance.container)
      modalInstances.delete(id)
    }, 300)
  }
}

// 关闭所有 Modal
function closeAllModals() {
  modalInstances.forEach((_, id) => {
    closeModal(id)
  })
}

// Modal API
export const modal = {
  /**
   * 显示 Modal 弹窗
   * @param options Modal 配置选项
   * @returns Promise<boolean> - true: 点击确认, false: 点击取消或关闭
   */
  show(options: ModalOptions): Promise<boolean> {
    return createModal(options)
  },

  /**
   * 显示确认弹窗
   * @param content 内容
   * @param title 标题
   */
  confirm(content: ModalContentType, title = i18n.global.t('common.confirmAction')): Promise<boolean> {
    return this.show({
      title,
      content,
      showConfirm: true,
      showCancel: true
    })
  },

  /**
   * 显示信息弹窗
   * @param content 内容
   * @param title 标题
   */
  info(content: ModalContentType, title = i18n.global.t('common.tip')): Promise<boolean> {
    return this.show({
      title,
      content,
      showConfirm: true,
      showCancel: false
    })
  },

  /**
   * 显示警告弹窗
   * @param content 内容
   * @param title 标题
   */
  warning(content: ModalContentType, title = i18n.global.t('common.warning')): Promise<boolean> {
    return this.show({
      title,
      content,
      showConfirm: true,
      showCancel: false,
      customClass: 'modal-warning'
    })
  },

  /**
   * 显示错误弹窗
   * @param content 内容
   * @param title 标题
   */
  error(content: ModalContentType, title = i18n.global.t('common.error')): Promise<boolean> {
    return this.show({
      title,
      content,
      showConfirm: true,
      showCancel: false,
      customClass: 'modal-error'
    })
  },

  /**
   * 关闭所有弹窗
   */
  closeAll(): void {
    closeAllModals()
  },

  /**
   * 配置全局设置
   */
  config(options: ModalConfig): void {
    Object.assign(globalConfig.value, options)
  },

  /**
   * 配置国际化
   */
  setI18n(i18n: ModalI18n): void {
    Object.assign(globalI18n.value, i18n)
  }
}

export { globalConfig, globalI18n }