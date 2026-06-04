<template>
  <div class="blog-home">
    <!-- ====== 1. Hero ====== -->
    <section class="blog-hero">
      <div class="blog-hero-content">
        <h1 class="hero-title">KOKO的博客</h1>
        <p class="hero-subtitle">探索代码、技术与生活的无限可能</p>
        <TypeWriter text="长风破浪会有时，直挂云帆济沧海。" />
        <button class="hero-cta" @click="scrollDown">了解更多</button>
      </div>
    </section>

    <!-- ====== 2. 数据看板条 ====== -->
    <section class="blog-section">
      <div class="container">
        <div class="stats-bar">
          <div class="stat-cell" v-for="s in stats" :key="s.label">
            <span class="stat-num">{{ animatedValues[s.key] ?? 0 }}</span>
            <span class="stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Music -->
    <section class="blog-section">
      <MusicPlayer />
    </section>

    <!-- ====== 3. Bento 导航宫格 ====== -->
    <section class="blog-section container">
      <h2 class="section-title">探索</h2>
      <div class="bento-grid">
        <RouterLink v-for="item in bentoItems" :key="item.path" :to="item.path" class="bento-card" :style="{ '--accent': item.color }">
          <span class="bento-icon">{{ item.icon }}</span>
          <span class="bento-label">{{ item.label }}</span>
          <span class="bento-desc">{{ item.desc }}</span>
        </RouterLink>
      </div>
    </section>

    <!-- ====== 4. 置顶推荐文章 ====== -->
    <section v-if="featuredArticle" class="blog-section container">
      <h2 class="section-title">推荐阅读</h2>
      <RouterLink :to="featuredArticle.path" class="featured-card">
        <div class="featured-bg"></div>
        <div class="featured-body">
          <span class="featured-tag">{{ featuredArticle.tag }}</span>
          <h3 class="featured-title">{{ featuredArticle.title }}</h3>
          <p class="featured-excerpt">{{ featuredArticle.excerpt }}</p>
          <span class="featured-date">{{ featuredArticle.date }}</span>
        </div>
        <span class="featured-arrow">→</span>
      </RouterLink>
    </section>

    <!-- ====== 5. 关于我 + 技能雷达 ====== -->
    <section class="blog-section container">
      <SectionCard :delay="100">
        <h2 class="section-title">关于我</h2>
        <div class="about-content">
          <div class="about-avatar">
            <div class="avatar-placeholder">G</div>
          </div>
          <div class="about-text">
            <p>一名热爱技术的前端开发者，专注于 Vue 生态与交互体验。</p>
            <p>这里记录我的学习、思考和成长轨迹。</p>
          </div>
        </div>

        <!-- 技能雷达 -->
        <div class="skill-radar">
          <div v-for="skill in skills" :key="skill.name" class="skill-bar-item">
            <div class="skill-bar-head">
              <span class="skill-bar-name">{{ skill.name }}</span>
              <span class="skill-bar-year">{{ skill.years }}</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" :style="{ width: skill.level + '%', background: skill.color }"></div>
            </div>
          </div>
        </div>
      </SectionCard>
    </section>

    <!-- ====== 6. 微型时间线 ====== -->
    <section class="blog-section container">
      <SectionCard :delay="150">
        <div class="mini-timeline-head">
          <h2 class="section-title" style="margin-bottom: 0;">成长轨迹</h2>
          <RouterLink to="/timeline" class="mini-timeline-more">查看全部 →</RouterLink>
        </div>
        <div class="mini-timeline">
          <div v-for="(item, i) in miniTimeline" :key="i" class="mini-tl-node">
            <div class="mini-tl-dot"></div>
            <div class="mini-tl-line" v-if="i < miniTimeline.length - 1"></div>
            <div class="mini-tl-card">
              <span class="mini-tl-date">{{ item.date }}</span>
              <span class="mini-tl-title">{{ item.title }}</span>
              <span class="mini-tl-org">{{ item.org }}</span>
            </div>
          </div>
        </div>
      </SectionCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, nextTick, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MusicPlayer from '@/components/blog/MusicPlayer.vue'
import TypeWriter from '@/components/blog/TypeWriter.vue'
import SectionCard from '@/components/blog/SectionCard.vue'
import { articles } from '@/views/articles/articles-data'
import { stats as statsBase, bentoItems, skills, miniTimeline } from '@/data/homepage'

// ==================== 数据看板（动态 target 从文章数据计算） ====================
const stats = statsBase.map(s => {
  if (s.key === 'articles') return { ...s, target: articles.length }
  if (s.key === 'tags') return { ...s, target: new Set(articles.map(a => a.tag)).size }
  return s
})

const animatedValues = ref<Record<string, number>>({})
let statsObserver: IntersectionObserver | null = null

function startCountUp() {
  stats.forEach(s => {
    const step = Math.max(1, Math.floor(s.target / 40))
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + step, s.target)
      animatedValues.value = { ...animatedValues.value, [s.key]: current }
      if (current >= s.target) clearInterval(timer)
    }, 30)
  })
}

// ==================== 推荐文章 ====================
const latestArticles = computed(() =>
  [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
)
const featuredArticle = computed(() => latestArticles.value[0] ?? null)

// ==================== Lifecycle ====================
onMounted(async () => {
  await nextTick()
  ScrollTrigger.refresh()

  // 数字滚动：视口进入时触发
  const bar = document.querySelector('.stats-bar')
  if (bar) {
    statsObserver = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) { startCountUp(); statsObserver?.disconnect() } },
      { threshold: 0.5 }
    )
    statsObserver.observe(bar)
  }
})

onUnmounted(() => {
  statsObserver?.disconnect()
})

function scrollDown() {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}
</script>

<style scoped>
.blog-home {
  position: relative;
  min-height: 100vh;
  color: var(--color-heading);
}

/* ====== 1. Hero ====== */
.blog-hero {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}

.blog-hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--color-accent-cyan) 0%, #a78bfa 25%, #f472b6 50%, var(--color-accent) 75%, var(--color-accent-cyan) 100%);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-flow 4s ease-in-out infinite;
}

@keyframes gradient-flow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-inverse-secondary);
  max-width: 400px;
}

.hero-cta {
  margin-top: 8px;
  padding: 12px 32px;
  border: 1px solid var(--color-accent);
  border-radius: 24px;
  color: var(--color-accent);
  font-size: 14px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-cta:hover {
  background: var(--color-accent);
  color: var(--color-heading);
}

.blog-section {
  position: relative;
  z-index: 2;
  padding: 40px 0;
}

.container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
  color: var(--color-heading);
}

/* ====== 2. 数据看板条 ====== */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.stat-cell {
  text-align: center;
  padding: var(--space-6) var(--space-4);
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-num {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
}

/* ====== 3. Bento 导航宫格 ====== */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.bento-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-6);
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.bento-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 3px;
  background: var(--accent, var(--color-accent));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bento-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent, var(--color-accent-cyan));
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.bento-card:hover::before {
  opacity: 1;
}

.bento-icon {
  font-size: 28px;
}

.bento-label {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-heading);
}

.bento-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
}

/* ====== 4. 置顶推荐文章 ====== */
.featured-card {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-8);
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-xl);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.featured-bg {
  position: absolute;
  top: -40%; right: -20%;
  width: 60%;
  height: 180%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.06));
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}

.featured-card:hover {
  transform: translateY(-2px);
  border-color: rgba(6, 182, 212, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}

.featured-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  position: relative;
  z-index: 1;
}

.featured-tag {
  align-self: flex-start;
  padding: 3px 12px;
  font-size: var(--font-size-xs);
  font-weight: 500;
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.25);
  border-radius: var(--radius-full);
}

.featured-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-heading);
  line-height: 1.4;
}

.featured-excerpt {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
  line-height: 1.7;
}

.featured-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
}

.featured-arrow {
  font-size: 28px;
  color: var(--color-accent-cyan);
  opacity: 0.4;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.featured-card:hover .featured-arrow {
  opacity: 1;
  transform: translateX(4px);
}

/* ====== 5. 关于我 + 技能雷达 ====== */
.about-content {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

.about-avatar { flex-shrink: 0; }

.avatar-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-cyan));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-heading);
}

.about-text p {
  color: var(--color-text-inverse-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.8;
}

/* 技能雷达条 */
.skill-radar {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

.skill-bar-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.skill-bar-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-bar-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
}

.skill-bar-year {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
}

.skill-bar-track {
  height: 6px;
  background: var(--color-bg-dark-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  border-radius: 3px;
  width: 0;
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 滚动观察器触发后通过脚本设宽度，此处为兜底 */
.skill-bar-fill {
  width: var(--fill, 0%);
}

/* ====== 6. 微型时间线 ====== */
.mini-timeline-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.mini-timeline-more {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-accent-cyan);
  transition: color 0.2s ease;
  white-space: nowrap;
}

.mini-timeline-more:hover {
  color: var(--color-accent);
}

.mini-timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-left: var(--space-4);
}

.mini-tl-node {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding-bottom: var(--space-5);
  position: relative;
}

.mini-tl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent-cyan);
  flex-shrink: 0;
  margin-top: 6px;
  box-shadow: 0 0 8px rgba(6, 182, 212, 0.4);
}

.mini-tl-line {
  position: absolute;
  left: 4px;
  top: 22px;
  width: 2px;
  height: calc(100% - 16px);
  background: var(--color-border-dark);
}

.mini-tl-card {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.mini-tl-date {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-accent-cyan);
}

.mini-tl-title {
  font-size: var(--font-size-sm);
  color: var(--color-text);
  font-weight: 500;
}

.mini-tl-org {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
}

/* ====== 响应式 - 768px ====== */
@media (max-width: 768px) {
  .hero-title { font-size: 32px; }
  .hero-subtitle { font-size: var(--font-size-base); max-width: 280px; }
  .blog-section { padding: 32px 0; }
  .container { padding: 0 var(--space-4); }
  .section-title { font-size: var(--font-size-xl); }

  /* 看板 */
  .stat-num { font-size: var(--font-size-2xl); }

  /* Bento */
  .bento-grid { grid-template-columns: repeat(2, 1fr); }

  /* 推荐文章 */
  .featured-card { flex-direction: column; padding: var(--space-6); gap: var(--space-4); }
  .featured-arrow { display: none; }
  .featured-bg { width: 100%; right: -40%; }

  /* 关于我 */
  .about-content { flex-direction: column; text-align: center; gap: var(--space-4); }
  .avatar-placeholder { width: 64px; height: 64px; font-size: 24px; }
}

/* ====== 响应式 - 480px ====== */
@media (max-width: 480px) {
  .hero-title { font-size: 28px; }
  .hero-subtitle { font-size: var(--font-size-sm); max-width: 240px; }
  .hero-cta { padding: 10px 24px; font-size: 13px; }
  .blog-section { padding: 24px 0; }
  .section-title { font-size: var(--font-size-lg); margin-bottom: var(--space-4); }

  /* 看板 */
  .stats-bar { gap: var(--space-3); }
  .stat-cell { padding: var(--space-4) var(--space-3); }
  .stat-num { font-size: var(--font-size-xl); }

  /* Bento */
  .bento-grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
  .bento-card { padding: var(--space-4); }
  .bento-icon { font-size: 22px; }
  .bento-label { font-size: var(--font-size-sm); }

  /* 推荐文章 */
  .featured-card { padding: var(--space-4); }
  .featured-title { font-size: var(--font-size-base); }

  /* 技能条 */
  .skill-bar-name { font-size: var(--font-size-xs); }
}
</style>
