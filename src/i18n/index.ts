import { watch } from 'vue'
import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'

const LOCALE_STORAGE_KEY = 'locale'

export type AppLocale = 'zh-CN' | 'en-US'

const SUPPORTED_LOCALES: AppLocale[] = ['zh-CN', 'en-US']

/**
 * 读取持久化的语言设置，非法值回退到中文。
 */
function resolveInitialLocale(): AppLocale {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
  return SUPPORTED_LOCALES.includes(saved as AppLocale) ? (saved as AppLocale) : 'zh-CN'
}

export const i18n = createI18n({
  legacy: false,
  locale: resolveInitialLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

/**
 * 语言的副作用统一收口：持久化、<html lang>、页面标题。
 * 通过 watch 监听 locale，无论是 setLocale 还是直接改 locale.value 都会生效。
 */
watch(
  i18n.global.locale,
  (locale) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.setAttribute('lang', locale)
    document.title = i18n.global.t('nav.brand')
  },
  { immediate: true },
)

/**
 * 切换语言：只负责更新 locale ref，副作用由上面的 watch 处理。
 */
export function setLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
}

/**
 * 在中英文之间切换。
 */
export function toggleLocale() {
  setLocale(i18n.global.locale.value === 'zh-CN' ? 'en-US' : 'zh-CN')
}
