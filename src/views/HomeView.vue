<template>
  <div class="home">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="container">
        <div class="hero-badge">{{ t('home.badge') }}</div>
        <h1 class="hero-title">
          {{ t('home.title') }}
          <span class="hero-highlight">{{ t('home.highlight') }}</span>
        </h1>
        <p class="hero-desc">{{ t('home.desc') }}</p>
        <div class="hero-actions">
          <RouterLink to="/about" class="btn btn-primary">
            {{ t('home.cta.demo') }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </RouterLink>
          <RouterLink to="/modal" class="btn btn-secondary">
            {{ t('home.cta.plugin') }}
          </RouterLink>
        </div>

        <!-- 功能卡片 -->
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <h3>{{ t('home.feature1.title') }}</h3>
            <p>{{ t('home.feature1.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <h3>{{ t('home.feature2.title') }}</h3>
            <p>{{ t('home.feature2.desc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <h3>{{ t('home.feature3.title') }}</h3>
            <p>{{ t('home.feature3.desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 组件交互演示 -->
    <section class="demo-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">{{ t('home.demo.section') }}</h2>
          <p class="section-desc">{{ t('home.demo.desc') }}</p>
        </div>

        <div class="demo-card">
          <div class="demo-header">
            <div class="demo-tag parent">Parent</div>
            <div class="demo-stats">
              <span class="stat-label">{{ t('home.demo.counter') }}:</span>
              <span class="stat-value">{{ fatherInfo.number }}</span>
            </div>
          </div>

          <div class="demo-body">
            <div class="child-wrapper">
              <div class="demo-tag child">Child</div>
              <HomeChild
                :fatherInfo="fatherInfo"
                ref="childInfo"
                @handleChildClick="childClick"
                @handleEdit="childEditClick"
              />
            </div>
          </div>

          <div class="demo-footer">
            <button class="btn btn-primary" @click="getInfo">
              {{ t('home.demo.readRef') }}
            </button>
            <span class="console-hint">{{ t('home.demo.hint') }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import HomeChild from './components/HomeChild.vue'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

const childInfo = ref()
const fatherInfo = ref({ name: 'Data from Parent', number: 144 })

// 读取子组件通过 defineExpose 暴露的引用并递增计数器
function getInfo() {
  console.log('Child expose:', childInfo.value)
  console.log('Child userName:', childInfo.value?.userName)
  fatherInfo.value.number++
}

// 子组件点击事件的回调
const childClick = (id: number, title: string) => {
  console.log('Child event - id:', id, 'title:', title)
}

// 子组件编辑事件的回调
const childEditClick = (info: object) => {
  console.log('Child edit event:', info)
}
</script>

<style scoped>
/* ===== Hero ===== */
.hero {
  padding: var(--space-16) 0 var(--space-10);
  text-align: center;
}

.hero-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-4);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  line-height: 1.15;
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  letter-spacing: -0.03em;
}

.hero-highlight {
  color: var(--color-primary);
}

.hero-desc {
  max-width: 540px;
  margin: 0 auto var(--space-8);
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-16);
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px 20px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  height: 44px;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.2);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-surface-tertiary);
  border-color: var(--color-border-hover);
}

/* ===== Features Grid ===== */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.feature-card {
  padding: var(--space-8) var(--space-6);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: left;
  transition: box-shadow var(--transition-base), border-color var(--transition-base);
}

.feature-card:hover {
  box-shadow: var(--shadow-md);
  border-color: transparent;
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.feature-card h3 {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-text-primary);
}

.feature-card p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* ===== Demo Section ===== */
.demo-section {
  padding: var(--space-12) 0;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
}

.section-desc {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.demo-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.demo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface-secondary);
  border-bottom: 1px solid var(--color-border);
}

.demo-footer {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface-secondary);
  border-top: 1px solid var(--color-border);
}

.demo-body {
  padding: var(--space-6);
}

.child-wrapper {
  background: var(--color-surface-tertiary);
  border: 1px dashed var(--color-border-hover);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.child-wrapper :deep(input) {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  margin-right: var(--space-2);
  margin-top: var(--space-2);
  transition: border-color var(--transition-fast);
}

.child-wrapper :deep(input:focus) {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.child-wrapper :deep(button) {
  padding: 8px 16px;
  margin-right: var(--space-2);
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.child-wrapper :deep(button:hover) {
  background: var(--color-surface-tertiary);
  border-color: var(--color-border-hover);
}

.demo-tag {
  display: inline-block;
  padding: 2px 10px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
}

.demo-tag.parent {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.demo-tag.child {
  color: var(--color-success);
  background: var(--color-success-light);
}

.demo-stats {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-primary);
}

.console-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .hero-desc {
    font-size: var(--font-size-base);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: var(--space-10) 0 var(--space-8);
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .section-title {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 480px) {
  .hero {
    padding: var(--space-8) 0 var(--space-6);
  }

  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-desc {
    font-size: var(--font-size-sm);
  }

  .hero-badge {
    font-size: var(--font-size-xs);
    padding: var(--space-1) var(--space-2);
  }

  .section-title {
    font-size: var(--font-size-lg);
  }

  .btn {
    padding: 8px 16px;
    font-size: var(--font-size-xs);
    min-height: 40px;
  }

  .container {
    padding: 0 var(--space-4);
  }
}
</style>
