import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  // 从 localStorage 读取持久化主题偏好，默认暗色
  const stored = localStorage.getItem('theme')
  const isDark = ref(stored ? stored === 'dark' : true)

  function toggle() {
    isDark.value = !isDark.value
  }

  // 持久化到 localStorage 并同步 DOM 属性
  watch(isDark, (val) => {
    localStorage.setItem('theme', val ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', val ? 'dark' : 'light')
  }, { immediate: true })

  return { isDark, toggle }
})
