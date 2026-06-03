<template>
  <div class="blog-home">
    <!-- Hero -->
    <section class="blog-hero">
      <div class="blog-hero-content">
        <h1 class="hero-title">KOKO的博客</h1>
        <p class="hero-subtitle">探索代码、技术与生活的无限可能</p>
        <button class="hero-cta" @click="scrollDown">了解更多</button>
      </div>
    </section>

    <!-- Music -->
    <section class="blog-section">
      <MusicPlayer />
    </section>

    <!-- TypeWriter Poem -->
    <section class="blog-section">
      <TypeWriter text="长风破浪会有时，直挂云帆济沧海。" />
    </section>

    <!-- Latest Articles -->
    <section class="blog-section container">
      <SectionCard>
        <h2 class="section-title">最新文章</h2>
        <div class="article-list">
          <div v-for="article in articles" :key="article.id" class="article-card">
            <div class="article-date">{{ article.date }}</div>
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-excerpt">{{ article.excerpt }}</p>
          </div>
          <p v-if="articles.length === 0" class="empty-hint">文章正在路上，敬请期待...</p>
        </div>
      </SectionCard>
    </section>

    <!-- About Me -->
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
        <div class="skill-tags">
          <span class="skill-tag">Vue 3</span>
          <span class="skill-tag">TypeScript</span>
          <span class="skill-tag">Node.js</span>
          <span class="skill-tag">Vite</span>
          <span class="skill-tag">Pinia</span>
        </div>
      </SectionCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MusicPlayer from '@/components/blog/MusicPlayer.vue'
import TypeWriter from '@/components/blog/TypeWriter.vue'
import SectionCard from '@/components/blog/SectionCard.vue'

const articles: Array<{ id: number; date: string; title: string; excerpt: string }> = []

onMounted(async () => {
  await nextTick()
  ScrollTrigger.refresh()
})

// 点击"了解更多"按钮，平滑滚动到下一屏
function scrollDown() {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}
</script>

<style scoped>
.blog-home {
  position: relative;
  min-height: 100vh;
  color: #fff;
}

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
  color: #fff;
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
  color: #fff;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.article-card {
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border-dark);
}

.article-card:last-child {
  border-bottom: none;
}

.article-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
  margin-bottom: 4px;
}

.article-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 4px;
}

.article-excerpt {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
}

.empty-hint {
  color: var(--color-text-inverse-tertiary);
  font-style: italic;
}

.about-content {
  display: flex;
  align-items: center;
  gap: var(--space-6);
  margin-bottom: var(--space-6);
}

.about-avatar {
  flex-shrink: 0;
}

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
  color: #fff;
}

.about-text p {
  color: var(--color-text-inverse-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.8;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.skill-tag {
  padding: 4px 14px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  color: var(--color-accent);
}

/* ===== 响应式适配 ===== */
@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
    max-width: 280px;
  }

  .blog-section {
    padding: 32px 0;
  }

  .container {
    padding: 0 var(--space-4);
  }

  .section-title {
    font-size: var(--font-size-xl);
  }

  .about-content {
    flex-direction: column;
    text-align: center;
    gap: var(--space-4);
  }

  .avatar-placeholder {
    width: 64px;
    height: 64px;
    font-size: 24px;
  }

  .about-text p {
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 28px;
  }

  .hero-subtitle {
    font-size: var(--font-size-sm);
    max-width: 240px;
  }

  .hero-cta {
    padding: 10px 24px;
    font-size: 13px;
  }

  .blog-section {
    padding: 24px 0;
  }

  .section-title {
    font-size: var(--font-size-lg);
    margin-bottom: var(--space-4);
  }
}
</style>
