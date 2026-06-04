<template>
  <div class="articles-page">
    <!-- Hero -->
    <section class="articles-hero">
      <div class="hero-inner">
        <h1 class="hero-title">文章</h1>
        <p class="hero-desc">技术思考、实战总结与面试精进</p>
      </div>
    </section>

    <!-- 文章列表 -->
    <section class="articles-list container">
      <SectionCard v-for="article in articles" :key="article.id" :delay="article.delay">
        <RouterLink :to="article.path" class="article-card-link">
          <div class="article-card">
            <div class="article-meta">
              <span class="article-date">{{ article.date }}</span>
              <span class="article-tag">{{ article.tag }}</span>
            </div>
            <h2 class="article-title">{{ article.title }}</h2>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            <span class="article-read-more">阅读全文 →</span>
          </div>
        </RouterLink>
      </SectionCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SectionCard from '@/components/blog/SectionCard.vue'

const articles = [
  {
    id: 'interview-advanced',
    title: '高级前端工程师面试精准答案',
    date: '2026-06-04',
    tag: '面试',
    excerpt: '涵盖 JavaScript 核心、Vue 深度、TypeScript、工程化、性能优化、安全、UniApp 跨端、系统设计等 11 个模块共 24 道高频面试题，附详细解答、代码示例与项目实战经验。',
    path: '/articles/interview-advanced',
    delay: 0,
  },
]
</script>

<style scoped>
.articles-page {
  min-height: 100vh;
  color: #fff;
}

/* ===== Hero ===== */
.articles-hero {
  padding: var(--space-16) var(--space-6) var(--space-10);
  text-align: center;
}

.hero-inner {
  max-width: 720px;
  margin: 0 auto;
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
  margin-top: var(--space-4);
  font-size: var(--font-size-lg);
  color: var(--color-text-inverse-secondary);
}

/* ===== 文章列表 ===== */
.articles-list {
  padding-bottom: var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.article-card-link {
  display: block;
  transition: transform 0.2s ease;
}

.article-card-link:hover {
  transform: translateY(-2px);
}

.article-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-1);
}

.article-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
}

.article-tag {
  padding: 2px 10px;
  font-size: var(--font-size-xs);
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: var(--radius-full);
}

.article-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: #e2e8f0;
}

.article-excerpt {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
  line-height: 1.7;
}

.article-read-more {
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-accent-cyan);
  transition: color 0.2s ease;
}

.article-card-link:hover .article-read-more {
  color: var(--color-accent);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .articles-hero {
    padding: var(--space-10) var(--space-4) var(--space-8);
  }

  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .hero-desc {
    font-size: var(--font-size-base);
  }

  .article-title {
    font-size: var(--font-size-lg);
  }
}

@media (max-width: 480px) {
  .articles-hero {
    padding: var(--space-8) var(--space-3) var(--space-6);
  }

  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-desc {
    font-size: var(--font-size-sm);
  }

  .articles-list {
    gap: var(--space-4);
  }

  .article-title {
    font-size: var(--font-size-base);
  }
}
</style>
