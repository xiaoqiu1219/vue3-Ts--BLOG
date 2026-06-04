<template>
  <div class="experience-page">
    <!-- ====== Hero 区：正常纵向滚动，在上方提供丰富内容 ====== -->
    <section class="exp-hero">
      <div class="hero-inner">
        <h1 class="hero-title">功能经历</h1>
        <p class="hero-desc">
          5 年前端开发经验，深度参与微信生态、支付体系、企业级管理系统等多领域项目。
          以下展示的是独立负责或主导交付的核心功能模块。
        </p>

        <!-- 快捷数据 -->
        <div class="hero-stats">
          <div v-for="s in heroStats" :key="s.label" class="stat-item">
            <span class="stat-num">{{ s.num }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>

        <!-- 技能标签云 -->
        <div class="hero-skills">
          <span v-for="skill in heroSkillPills" :key="skill" class="skill-pill">{{ skill }}</span>
        </div>

        <!-- 向下滚动引导 -->
        <div class="hero-scroll-hint">
          <span class="scroll-text">向下滚动浏览功能模块</span>
          <span class="scroll-arrow"></span>
        </div>
      </div>
    </section>

    <!-- ====== 横向滚动卡片区 ====== -->
    <section class="exp-horizontal" ref="horizontalSection">
      <div class="exp-track">
        <!-- 卡片行（含左侧引导） -->
        <div class="exp-row" ref="expRow">
          <!-- 左侧引导 -->
          <div class="exp-intro">
            <h2 class="intro-label">核心功能</h2>
            <p class="intro-hint">← 横向滑动浏览 →</p>
            <span class="intro-arrow">→</span>
          </div>
          <div
            v-for="item in features"
            :key="item.id"
            class="exp-card"
          >
            <div class="card-accent" :style="{ background: item.color }"></div>
            <div class="card-body">
              <div class="card-icon">{{ item.icon }}</div>
              <h3 class="card-title">{{ item.name }}</h3>
              <p class="card-desc">{{ item.description }}</p>
            </div>
            <div class="card-footer">
              <span v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</span>
            </div>
            <!-- hover 浮层：显示完整描述（暂注释） -->
            <!-- <div class="card-tooltip">{{ item.description }}</div> -->
          </div>
        </div>
      </div>

      <!-- 进度条：绝对定位在容器内，不引发全局抖动 -->
      <div class="scroll-progress">
        <div class="progress-fill" ref="progressFill"></div>
      </div>
    </section>

    <!-- ====== 底部收尾区 ====== -->
    <section class="exp-footer">
      <div class="footer-inner">
        <div class="footer-divider">
          <span class="divider-icon">◆</span>
        </div>
        <h2 class="footer-title">技术栈总览</h2>
        <p class="footer-desc">
          涵盖 Vue 生态、微信生态、支付体系、数据可视化、工程化建设等多个领域，
          具备从 0 到 1 独立交付复杂业务模块的能力。
        </p>

        <!-- 技术栈分组 -->
        <div class="footer-groups">
          <div v-for="group in techGroups" :key="group.label" class="footer-group">
            <h3 class="group-label">{{ group.label }}</h3>
            <div class="group-tags">
              <span v-for="tag in group.tags" :key="tag" class="g-tag">{{ tag }}</span>
            </div>
          </div>
        </div>

        <!-- 底部链接 -->
        <div class="footer-links">
          <RouterLink to="/timeline" class="footer-link">查看时间线 →</RouterLink>
          <RouterLink to="/articles" class="footer-link">浏览文章 →</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { features, heroSkillPills, techGroups, heroStats } from '@/data/features'

gsap.registerPlugin(ScrollTrigger)

// ==================== GSAP 横向滚动 ====================
const horizontalSection = ref<HTMLElement | null>(null)
const expRow = ref<HTMLElement | null>(null)
const progressFill = ref<HTMLElement | null>(null)

let horizontalTween: gsap.core.Tween | null = null

onMounted(async () => {
  await nextTick()

  const section = horizontalSection.value
  const row = expRow.value
  if (!section || !row) return

  const getScrollDistance = () => {
    const introWidth = (section.querySelector('.exp-intro') as HTMLElement)?.offsetWidth || 200
    const cardsWidth = row.scrollWidth
    // 末尾留少量余量让最后一张卡片完成动画，底部内容区承接后续滚动
    return Math.max(0, introWidth + cardsWidth - window.innerWidth + window.innerWidth * 0.2)
  }

  // 1. 主横向滚动：pin + scrub
  horizontalTween = gsap.to(row, {
    x: () => -getScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${getScrollDistance()}`,
      scrub: true,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (progressFill.value) {
          // 用 transform scaleX 替代 width，GPU 加速无重排
          progressFill.value.style.transform = `scaleX(${self.progress})`
        }
      },
    },
  })

  // 2. 卡片交叉入场：奇数从上落下，偶数从下升上
  const cards = gsap.utils.toArray(section.querySelectorAll('.exp-card')) as HTMLElement[]
  cards.forEach((card, i) => {
    const isOdd = i % 2 === 0
    gsap.fromTo(
      card,
      {
        y: isOdd ? -200 : 200,
        rotation: isOdd ? 15 : -10,
        opacity: 0,
        scale: 0.85,
      },
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        scale: 1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: card,
          containerAnimation: horizontalTween!,
          start: 'right 105%',
          end: 'right 70%',
          scrub: true,
        },
      },
    )
  })

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style scoped>
/* ==================== 页面容器 ==================== */
.experience-page {
  background: var(--color-bg-dark);
  color: var(--color-heading);
}

/* ==================== Hero 区 ==================== */
.exp-hero {
  padding: var(--space-12) var(--space-6) var(--space-4);
}

.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(
    135deg,
    var(--color-accent-cyan) 0%,
    #a78bfa 25%,
    #f472b6 50%,
    var(--color-accent) 75%,
    var(--color-accent-cyan) 100%
  );
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: hero-gradient 4s ease-in-out infinite;
}

@keyframes hero-gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-desc {
  margin-top: var(--space-5);
  font-size: var(--font-size-base);
  color: var(--color-text-inverse-secondary);
  line-height: 1.8;
  max-width: 540px;
  margin-left: auto;
  margin-right: auto;
}

/* 快捷数据 */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: var(--space-12);
  margin-top: var(--space-8);
  padding: var(--space-6) 0;
  border-top: 1px solid var(--color-border-dark);
  border-bottom: 1px solid var(--color-border-dark);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.stat-num {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-accent-cyan);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* 技能标签云 */
.hero-skills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
}

.skill-pill {
  padding: var(--space-1) var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-full);
  transition: all 0.2s ease;
}

.skill-pill:hover {
  color: var(--color-accent-cyan);
  border-color: var(--color-accent-cyan);
}

/* 向下滚动引导 */
.hero-scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-6);
  animation: hint-fade 2s ease-in-out infinite;
}

.scroll-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
}

.scroll-arrow {
  display: block;
  width: 20px;
  height: 20px;
  border-right: 2px solid var(--color-text-inverse-tertiary);
  border-bottom: 2px solid var(--color-text-inverse-tertiary);
  transform: rotate(45deg);
  opacity: 0.5;
}

@keyframes hint-fade {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* ==================== 横向滚动区 ==================== */
.exp-horizontal {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.exp-track {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 var(--space-16);
}

/* ==================== 左侧引导 ==================== */
.exp-intro {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  padding-right: var(--space-16);
  min-width: 200px;
}

.intro-label {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text);
  white-space: nowrap;
}

.intro-hint {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
}

.intro-arrow {
  font-size: 24px;
  color: var(--color-accent-cyan);
  animation: arrow-pulse 1.5s ease-in-out infinite;
}

@keyframes arrow-pulse {
  0%, 100% { opacity: 0.3; transform: translateX(0); }
  50% { opacity: 1; transform: translateX(8px); }
}

/* ==================== 卡片行 ==================== */
.exp-row {
  display: flex;
  gap: var(--space-6);
  align-items: center;
  flex-shrink: 0;
}

/* ==================== 卡片 ==================== */
.exp-card {
  flex-shrink: 0;
  width: 300px;
  height: 280px;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-lg);
  overflow: visible;
  position: relative;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

/* .exp-card:hover {
  transform: translateY(-8px) !important;
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.5),
    0 0 1px rgba(6, 182, 212, 0.5);
  z-index: 10;
} */

.card-accent {
  height: 4px;
  width: 100%;
  flex-shrink: 0;
}

.card-body {
  padding: var(--space-5) var(--space-5) var(--space-3);
  flex: 1;
}

.card-icon {
  font-size: 22px;
  margin-bottom: var(--space-3);
  background: var(--color-bg-dark-tertiary);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--color-accent-cyan);
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-2);
  line-height: 1.4;
}

.card-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
  line-height: 1.7;
  /* 默认最多显示 3 行，超出省略 */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-5);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.card-tag {
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  transition: color 0.2s ease, background 0.2s ease;
}

/* .exp-card:hover .card-tag {
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.1);
} */

/* ==================== hover 浮层 tip（暂注释） ==================== */
/* .card-tooltip {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  padding: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  line-height: 1.7;
  background: var(--color-bg-dark-tertiary);
  border: 1px solid var(--color-accent-cyan);
  border-radius: var(--radius-md);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.6),
    0 0 8px rgba(6, 182, 212, 0.2);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition:
    opacity 0.25s ease,
    visibility 0.25s ease,
    transform 0.25s ease;
  z-index: 30;
  pointer-events: none;
}

.exp-card:hover .card-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
} */

/* ==================== 进度条（绝对定位，无抖动） ==================== */
.scroll-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  z-index: 10;
}

.progress-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, var(--color-accent-cyan), var(--color-accent), #a78bfa);
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
}

/* ==================== 底部收尾区 ==================== */
.exp-footer {
  padding: var(--space-12) var(--space-6);
  background: var(--color-bg-dark);
}

.footer-inner {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.footer-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-6);
}

.divider-icon {
  color: var(--color-accent-cyan);
  font-size: 12px;
  text-shadow: 0 0 8px rgba(6, 182, 212, 0.5);
}

.footer-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-4);
}

.footer-desc {
  font-size: var(--font-size-base);
  color: var(--color-text-inverse-secondary);
  line-height: 1.7;
  max-width: 500px;
  margin: 0 auto var(--space-10);
}

/* 技术栈分组 */
.footer-groups {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  text-align: left;
  margin-bottom: var(--space-10);
}

.footer-group {
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
}

.group-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-accent-cyan);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-3);
}

.group-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.g-tag {
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-sm);
}

/* 底部链接 */
.footer-links {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
}

.footer-link {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-accent-cyan);
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-accent);
}

/* ==================== 响应式 ==================== */
@media (max-width: 768px) {
  .exp-hero {
    padding: var(--space-8) var(--space-4) var(--space-6);
  }

  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .hero-desc {
    font-size: var(--font-size-sm);
  }

  .hero-stats {
    gap: var(--space-8);
  }

  .stat-num {
    font-size: var(--font-size-2xl);
  }

  .exp-track {
    padding: 0 var(--space-6);
  }

  .exp-intro {
    min-width: 140px;
    padding-right: var(--space-8);
  }

  .intro-label {
    font-size: var(--font-size-base);
  }

  .exp-card {
    width: 260px;
  }

  .footer-groups {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .exp-hero {
    padding: var(--space-6) var(--space-3) var(--space-4);
  }

  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-desc {
    font-size: var(--font-size-xs);
    max-width: 100%;
  }

  .hero-stats {
    gap: var(--space-6);
    padding: var(--space-4) 0;
  }

  .stat-num {
    font-size: var(--font-size-xl);
  }

  .stat-label {
    font-size: 11px;
  }

  .hero-skills {
    gap: var(--space-1);
  }

  .skill-pill {
    padding: var(--space-1) var(--space-3);
    font-size: var(--font-size-xs);
  }

  .exp-horizontal {
    height: 70vh;
  }

  .exp-track {
    padding: 0 var(--space-4);
  }

  .exp-intro {
    min-width: 100px;
    padding-right: var(--space-4);
  }

  .intro-label {
    font-size: var(--font-size-sm);
  }

  .intro-hint {
    font-size: var(--font-size-xs);
  }

  .intro-arrow {
    font-size: 18px;
  }

  .exp-card {
    width: 220px;
    height: 260px;
  }

  .card-icon {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .card-title {
    font-size: var(--font-size-sm);
  }

  .card-desc {
    font-size: var(--font-size-xs);
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .card-body {
    padding: var(--space-3) var(--space-3) var(--space-2);
  }

  .card-footer {
    padding: var(--space-2) var(--space-3);
  }

  .card-tag {
    padding: 1px 6px;
    font-size: 11px;
  }

  .exp-footer {
    padding: var(--space-8) var(--space-4);
  }

  .footer-title {
    font-size: var(--font-size-xl);
  }

  .footer-desc {
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-8);
  }

  .footer-link {
    font-size: var(--font-size-xs);
  }
}
</style>
