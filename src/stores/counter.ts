import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 计数器 Store，演示 Pinia 组合式 API 的基本用法
export const useCounterStore = defineStore('counter', () => {
  // 计数器数值
  const count = ref(0)
  // 派生状态：count 的两倍
  const doubleCount = computed(() => count.value * 2)
  // 递增计数器
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
