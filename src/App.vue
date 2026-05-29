<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const { t, locale, toggleLocale } = useI18n()

const navItems = computed(() => [
  { path: '/', key: 'nav.home' },
  { path: '/about', key: 'nav.about' },
  { path: '/modal', key: 'nav.modal' },
])

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="app-shell">
    <!-- Top Navigation Bar -->
    <header class="navbar">
      <div class="navbar-inner">
        <RouterLink to="/" class="navbar-brand">
          <div class="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L3 8v12l11 6 11-6V8L14 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M14 14l-6-3.5M14 14l6-3.5M14 14v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="brand-text">{{ t('brand.text') }}</span>
        </RouterLink>

        <nav class="navbar-nav" aria-label="Main navigation">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            :class="{ active: isActive(item.path) }"
          >
            {{ t(item.key) }}
          </RouterLink>
        </nav>

        <div class="navbar-actions">
          <!-- Language Switcher -->
          <button
            class="lang-switch"
            @click="toggleLocale"
            :aria-label="locale === 'zh' ? 'Switch to English' : '切换到中文'"
            :title="locale === 'zh' ? 'Switch to English' : '切换到中文'"
          >
            <span class="lang-label">{{ locale === 'zh' ? '中' : 'EN' }}</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-icon"
            :aria-label="t('github.aria')"
            :title="t('github.aria')"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/>
            </svg>
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>{{ t('footer.text') }}</p>
    </footer>
  </div>
</template>

<style scoped>
/* ===== App Shell ===== */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== Navbar ===== */
.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  height: var(--navbar-height);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  transition: box-shadow var(--transition-base);
}

.navbar-inner {
  display: flex;
  align-items: center;
  height: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
  gap: var(--space-8);
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-primary);
  transition: opacity var(--transition-fast);
  flex-shrink: 0;
}

.navbar-brand:hover {
  opacity: 0.8;
}

.brand-icon {
  color: var(--color-primary);
}

.brand-text {
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Nav Links */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex: 1;
  justify-content: center;
}

.nav-link {
  position: relative;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-tertiary);
}

.nav-link.active {
  color: var(--color-primary);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: var(--color-primary);
  border-radius: var(--radius-full);
}

/* Language Switcher */
.lang-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: color var(--transition-fast), background var(--transition-fast);
  font-size: var(--font-size-xs);
  font-weight: 700;
  letter-spacing: 0.02em;
  user-select: none;
}

.lang-switch:hover {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.lang-label {
  line-height: 1;
}

/* Actions */
.navbar-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: var(--space-1);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: color var(--transition-fast), background var(--transition-fast);
}

.btn-icon:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-tertiary);
}

/* ===== Main Content ===== */
.main-content {
  flex: 1;
  padding: var(--space-8) 0;
}

/* ===== Footer ===== */
.footer {
  text-align: center;
  padding: var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  border-top: 1px solid var(--color-border);
}

/* ===== Page Transitions ===== */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .navbar-nav {
    gap: 0;
  }

  .nav-link {
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-xs);
  }

  .brand-text {
    display: none;
  }

  .main-content {
    padding: var(--space-6) 0;
  }
}
</style>
