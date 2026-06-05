<template>
  <header class="blog-navbar">
    <div class="blog-navbar-inner">
      <RouterLink to="/" class="blog-brand">
        <img src="@/assets/cat.jpg" alt="头像" class="brand-avatar" />
        <span class="brand-text">KOKO的博客</span>
      </RouterLink>

      <!-- 桌面端导航 -->
      <nav class="blog-nav desktop-nav">
        <RouterLink
          v-for="item in mainNav"
          :key="item.path"
          :to="item.path"
          class="blog-nav-link"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.label }}
        </RouterLink>

        <!-- 小游戏下拉 -->
        <div class="nav-dropdown" @mouseenter="gamesOpen = true" @mouseleave="gamesOpen = false">
          <span class="blog-nav-link dropdown-trigger" :class="{ active: isActive('/games') }">🎮 小游戏 ▾</span>
          <Transition name="dropdown-fade">
            <div v-if="gamesOpen" class="dropdown-menu">
              <RouterLink
                v-for="sub in gamesNav"
                :key="sub.path"
                :to="sub.path"
                class="dropdown-item"
              >
                {{ sub.label }}
              </RouterLink>
            </div>
          </Transition>
        </div>

        <!-- 更多下拉 -->
        <div class="nav-dropdown" @mouseenter="open = true" @mouseleave="open = false">
          <span class="blog-nav-link dropdown-trigger">更多 ▾</span>
          <Transition name="dropdown-fade">
            <div v-if="open" class="dropdown-menu">
              <RouterLink
                v-for="sub in adminNav"
                :key="sub.path"
                :to="sub.path"
                class="dropdown-item"
              >
                {{ sub.label }}
              </RouterLink>
              <div class="dropdown-divider"></div>
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

        <!-- 明暗主题切换 -->
        <button
          class="theme-toggle"
          @click="themeStore.toggle()"
          :aria-label="themeStore.isDark ? '切换白天模式' : '切换黑夜模式'"
          :title="themeStore.isDark ? '切换白天模式' : '切换黑夜模式'"
        >
          <span class="theme-icon">{{ themeStore.isDark ? '☀️' : '🌙' }}</span>
        </button>
      </nav>

      <!-- 移动端汉堡按钮 -->
      <button class="hamburger-btn" @click="mobileOpen = !mobileOpen" aria-label="菜单">
        <span class="hamburger-line" :class="{ open: mobileOpen }"></span>
        <span class="hamburger-line" :class="{ open: mobileOpen }"></span>
        <span class="hamburger-line" :class="{ open: mobileOpen }"></span>
      </button>
    </div>

    <!-- 移动端下拉菜单 -->
    <Transition name="mobile-menu-fade">
      <nav v-if="mobileOpen" class="mobile-nav">
        <RouterLink
          v-for="item in allNav"
          :key="item.path"
          :to="item.path"
          class="mobile-nav-link"
          :class="{ active: isActive(item.path) }"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { mainNav, practiceNav, gamesNav, adminNav } from '@/data/navigation'

const route = useRoute()
const themeStore = useThemeStore()
const open = ref(false)
const gamesOpen = ref(false)
const mobileOpen = ref(false)

// 移动端合并所有导航
const allNav = computed(() => [...mainNav, ...gamesNav, ...adminNav, ...practiceNav])

// 判断当前路由是否匹配导航项，首页精确匹配，其他前缀匹配
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
  background: var(--color-bg-dark-nav);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-dark);
  /* 安全区域适配 */
  padding-top: var(--safe-area-top);
}

.blog-navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.blog-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-heading);
  flex-shrink: 0;
  letter-spacing: -0.02em;
}

.brand-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(6, 182, 212, 0.4);
  transition: border-color 0.2s ease;
}

.brand-text {
  white-space: nowrap;
}

.blog-brand:hover .brand-avatar {
  border-color: var(--color-accent-cyan);
}

/* 桌面端导航 */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.blog-nav-link {
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-inverse-secondary);
  border-radius: var(--radius-md);
  transition: color 0.15s ease;
  cursor: pointer;
  white-space: nowrap;
}

.blog-nav-link:hover {
  color: var(--color-heading);
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
  color: var(--color-heading);
  background: rgba(255, 255, 255, 0.05);
}

.dropdown-divider {
  height: 1px;
  margin: 4px 8px;
  background: var(--color-border-dark);
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

/* 主题切换按钮 */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  margin-left: var(--space-2);
  font-size: 16px;
  background: transparent;
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.theme-toggle:hover {
  border-color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.08);
}

.theme-icon {
  line-height: 1;
}

/* 汉堡按钮 */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--color-heading);
  border-radius: 1px;
  transition: all 0.3s ease;
}

.hamburger-line.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger-line.open:nth-child(2) {
  opacity: 0;
}

.hamburger-line.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* 移动端导航 */
.mobile-nav {
  display: none;
  flex-direction: column;
  padding: var(--space-4) var(--space-6);
  background: var(--color-bg-dark-nav-solid);
  border-bottom: 1px solid var(--color-border-dark);
}

.mobile-nav-link {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-inverse-secondary);
  border-radius: var(--radius-md);
  transition: color 0.15s ease, background 0.15s ease;
  min-height: var(--touch-target-min);
  display: flex;
  align-items: center;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.1);
}

.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===== 响应式适配 ===== */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .hamburger-btn {
    display: flex;
  }

  .mobile-nav {
    display: flex;
  }

  .brand-text {
    font-size: var(--font-size-base);
  }

  .blog-navbar-inner {
    padding: 0 var(--space-4);
  }
}

@media (max-width: 480px) {
  .blog-navbar {
    height: 56px;
  }

  .brand-avatar {
    width: 28px;
    height: 28px;
  }
}
</style>