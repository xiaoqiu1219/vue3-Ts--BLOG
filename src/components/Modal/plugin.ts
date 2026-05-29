import type { App } from 'vue'
import { modal, globalConfig, globalI18n } from './modal'
import type { ModalPluginOptions, ModalOptions, ModalI18n } from './types'

// Vue 插件：安装 ModalPlugin 后可通过 app.use() 注册，同时注入 $modal 全局属性和 provide
export const ModalPlugin = {
  install(app: App, options?: ModalPluginOptions) {
    // 配置全局设置
    if (options) {
      const { i18n, ...config } = options

      if (Object.keys(config).length > 0) {
        modal.config(config)
      }

      if (i18n) {
        modal.setI18n(i18n)
      }
    }

    // 提供全局配置
    app.provide('modalConfig', globalConfig)
    app.provide('modalI18n', globalI18n)

    // 全局属性
    app.config.globalProperties.$modal = modal

    // 全局组件注入
    app.provide('$modal', modal)
  }
}

// 导出类型和 API
export { modal }
export type { ModalOptions, ModalPluginOptions, ModalI18n, ModalConfig, ModalContentType } from './types'
export { default as ModalComponent } from './Modal.vue'