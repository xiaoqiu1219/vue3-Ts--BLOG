<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'
import MouseTrail from '@/components/blog/MouseTrail.vue'
import MusicMini from '@/components/blog/MusicMini.vue'
import { useMusicStore } from '@/stores/music'

const route = useRoute()

// 判断当前是否在练手页面路由下，用于切换主题样式
const isPractice = computed(() => route.path.startsWith('/practice'))

// 全局初始化音频元素，确保切换页面时音乐不中断
const musicStore = useMusicStore()
onMounted(() => {
  musicStore.initAudio()
})
</script>

<template>
  <div class="app-shell" :class="{ 'practice-mode': isPractice }">
    <MouseTrail />
    <AppNavbar />
    <!-- 全局迷你音乐播放器：非首页时显示在右上角 -->
    <MusicMini />
    <main class="main-content" :class="{ 'no-padding': !isPractice }">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<style>
/* Global: blog dark mode as default */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg-dark);
}

.main-content {
  flex: 1;
}

.main-content.no-padding {
  padding: 0;
}

/* Page transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* Practice pages use light theme overrides - scoped to practice-mode container */
.practice-mode {
  background: var(--color-surface-secondary);
}

.practice-mode .main-content {
  padding: var(--space-8) 0;
}
</style>
