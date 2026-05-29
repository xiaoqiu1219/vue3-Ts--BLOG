<template>
  <header class="blog-navbar">
    <div class="blog-navbar-inner">
      <RouterLink to="/" class="blog-brand">KOKO的博客</RouterLink>

      <nav class="blog-nav">
        <RouterLink
          v-for="item in mainNav"
          :key="item.path"
          :to="item.path"
          class="blog-nav-link"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.label }}
        </RouterLink>

        <div class="nav-dropdown" @mouseenter="open = true" @mouseleave="open = false">
          <span class="blog-nav-link dropdown-trigger">更多 ▾</span>
          <Transition name="dropdown-fade">
            <div v-if="open" class="dropdown-menu">
              <RouterLink
                v-for="sub in practiceNav"
                :key="sub.path"
                :to="sub.path"
                class="dropdown-item"
              >
                {{ sub.label }}
              </RouterLink>
            </div>
          </Transition>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)

const mainNav = [
  { path: '/', label: '首页' },
  { path: '/timeline', label: '时间线' },
  { path: '/articles', label: '文章' },
  { path: '/experience', label: '经历' },
  { path: '/friends', label: '友链' },
]

const practiceNav = [
  { path: '/practice/home', label: '练手·首页' },
  { path: '/practice/about', label: '练手·关于' },
  { path: '/practice/modal', label: '练手·弹窗' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.blog-navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  height: var(--navbar-height);
  background: rgba(10, 10, 26, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-dark);
}

.blog-navbar-inner {
  display: flex;
  align-items: center;
  height: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
  gap: var(--space-8);
}

.blog-brand {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

.blog-nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
  justify-content: center;
}

.blog-nav-link {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-inverse-secondary);
  border-radius: var(--radius-md);
  transition: color 0.15s ease;
  cursor: pointer;
}

.blog-nav-link:hover {
  color: #fff;
}

.blog-nav-link.active {
  color: var(--color-accent-cyan);
}

.nav-dropdown {
  position: relative;
}

.dropdown-trigger {
  user-select: none;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 140px;
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  padding: var(--space-1) 0;
  box-shadow: var(--shadow-lg);
}

.dropdown-item {
  display: block;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
  transition: color 0.15s ease, background 0.15s ease;
}

.dropdown-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
