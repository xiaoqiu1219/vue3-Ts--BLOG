<template>
  <div class="article-page">
    <!-- ===== Hero ===== -->
    <section class="article-hero">
      <div class="hero-inner">
        <div class="hero-breadcrumb">
          <RouterLink to="/articles" class="breadcrumb-link">← 返回文章列表</RouterLink>
        </div>
        <h1 class="hero-title">高级前端工程师面试精准答案</h1>
        <p class="hero-desc">涵盖 JavaScript 核心、Vue 深度、TypeScript、工程化、性能优化、安全、UniApp 跨端、系统设计与软技能等 11 个模块，共 24 道高频面试题，附详细解答与项目实战代码。</p>
        <div class="hero-meta">
          <span class="meta-date">2026-06-04</span>
          <span class="meta-divider">·</span>
          <span class="meta-reading">阅读约 45 分钟</span>
          <span class="meta-divider">·</span>
          <span class="meta-tag">面试</span>
        </div>
      </div>
    </section>

    <!-- ===== 正文区（目录 + 内容） ===== -->
    <div class="article-body container">
      <!-- 侧边目录（桌面端） -->
      <aside class="article-toc-desktop">
        <nav class="toc-nav">
          <h3 class="toc-title">目录</h3>
          <ul class="toc-list">
            <li v-for="section in sections" :key="section.id" class="toc-item">
              <a
                :href="`#section-${section.id}`"
                class="toc-link"
                :class="{ 'toc-active': activeSection === section.id }"
                @click.prevent="scrollToSection(section.id)"
              >{{ section.label }}</a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 移动端目录折叠 -->
      <details class="article-toc-mobile">
        <summary class="toc-mobile-summary">
          <span>📑 目录</span>
          <span class="toc-mobile-arrow">▼</span>
        </summary>
        <nav class="toc-mobile-nav">
          <a
            v-for="section in sections"
            :key="section.id"
            :href="`#section-${section.id}`"
            class="toc-mobile-link"
            @click.prevent="scrollToMobile(section.id)"
          >{{ section.label }}</a>
        </nav>
      </details>

      <!-- 正文内容 -->
      <div class="article-content">
        <template v-for="section in sections" :key="section.id">
          <!-- 一级章节标题 -->
          <section :id="`section-${section.id}`" class="content-section">
            <h2 class="section-heading">{{ section.number }} {{ section.label }}</h2>

            <template v-for="qa in section.questions" :key="qa.id">
              <!-- 二级问题标题 -->
              <h3 class="question-heading" :id="`q-${qa.id}`">{{ qa.title }}</h3>

              <!-- 回答内容（支持 HTML） -->
              <div class="answer-body" v-html="qa.answer"></div>
            </template>
          </section>
        </template>

        <!-- 底部导航 -->
        <div class="article-footer-nav">
          <RouterLink to="/articles" class="footer-back-link">← 返回文章列表</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { articleSections } from './interview-content'

const sections = articleSections
const activeSection = ref<string>('')
// 缓存章节 DOM 元素，避免滚动时重复查询
let sectionElements: (HTMLElement | null)[] = []

// 滚动到指定章节
function scrollToSection(id: string) {
  const el = document.getElementById(`section-${id}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// 移动端滚动并关闭目录
function scrollToMobile(id: string) {
  scrollToSection(id)
  const details = document.querySelector('.article-toc-mobile') as HTMLDetailsElement
  if (details) details.open = false
}

// 监听滚动，高亮当前章节（元素引用已缓存，避免每帧查询 DOM）
function onScroll() {
  const scrollTop = window.scrollY + 120

  for (let i = sectionElements.length - 1; i >= 0; i--) {
    const el = sectionElements[i]
    if (el && el.offsetTop <= scrollTop) {
      activeSection.value = sections[i].id
      return
    }
  }
  activeSection.value = sections[0]?.id || ''
}

onMounted(() => {
  // 首次缓存所有章节 DOM 引用
  sectionElements = sections.map(s => document.getElementById(`section-${s.id}`))
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* ===== 页面容器 ===== */
.article-page {
  min-height: 100vh;
  background: var(--color-bg-dark);
  color: #e2e8f0;
  padding-bottom: var(--space-16);
}

/* ===== Hero ===== */
.article-hero {
  padding: var(--space-12) var(--space-6) var(--space-8);
  text-align: center;
  border-bottom: 1px solid var(--color-border-dark);
}

.hero-inner {
  max-width: 800px;
  margin: 0 auto;
}

.hero-breadcrumb {
  margin-bottom: var(--space-6);
}

.breadcrumb-link {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--color-accent-cyan);
}

.hero-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.2;
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
}

.hero-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
}

.meta-divider {
  color: var(--color-text-inverse-tertiary);
  opacity: 0.4;
}

.meta-tag {
  padding: 2px 10px;
  font-size: var(--font-size-xs);
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: var(--radius-full);
}

/* ===== 正文布局 ===== */
.article-body {
  display: flex;
  gap: var(--space-10);
  margin-top: var(--space-10);
  padding: 0 var(--space-6);
  max-width: var(--content-max-width);
}

/* ===== 桌面端目录（sticky 侧边栏） ===== */
.article-toc-desktop {
  width: 220px;
  flex-shrink: 0;
  position: sticky;
  top: calc(var(--navbar-height) + var(--space-6));
  align-self: flex-start;
  max-height: calc(100vh - var(--navbar-height) - var(--space-12));
  overflow-y: auto;
}

.toc-nav {
  padding: var(--space-5);
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-lg);
}

.toc-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border-dark);
}

.toc-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-item {
  line-height: 1.4;
}

.toc-link {
  display: block;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
}

.toc-link:hover {
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.08);
}

.toc-link.toc-active {
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.12);
}

/* ===== 移动端目录（折叠） ===== */
.article-toc-mobile {
  display: none;
}

/* ===== 正文内容区 ===== */
.article-content {
  flex: 1;
  min-width: 0;
}

.content-section {
  margin-bottom: var(--space-12);
  padding-top: var(--space-4);
}

.section-heading {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-3);
  border-bottom: 2px solid rgba(6, 182, 212, 0.2);
}

.question-heading {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: #cbd5e1;
  margin-top: var(--space-8);
  margin-bottom: var(--space-4);
  padding-left: var(--space-3);
  border-left: 3px solid var(--color-accent-cyan);
}

/* ===== 回答内容通用样式 ===== */
.answer-body {
  font-size: var(--font-size-base);
  line-height: 1.85;
  color: var(--color-text-inverse-secondary);
}

/* 段落 */
.answer-body :deep(p) {
  margin-bottom: var(--space-4);
}

/* 强调 */
.answer-body :deep(strong) {
  color: #e2e8f0;
  font-weight: 600;
}

/* 行内代码 */
.answer-body :deep(code:not(pre code)) {
  padding: 1px 6px;
  font-family: var(--font-mono);
  font-size: 0.88em;
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: var(--radius-sm);
  white-space: nowrap;
}

/* 代码块 */
.answer-body :deep(pre) {
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: #0d0d24;
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  overflow-x: auto;
  position: relative;
}

.answer-body :deep(pre code) {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  line-height: 1.7;
  color: #c9d1d9;
  background: transparent;
  border: none;
  padding: 0;
  white-space: pre;
  display: block;
}

/* 代码块语言标签 */
.answer-body :deep(pre)::before {
  content: attr(data-lang);
  position: absolute;
  top: 0;
  right: var(--space-3);
  padding: 2px 8px;
  font-size: 11px;
  color: var(--color-text-inverse-tertiary);
  background: rgba(255, 255, 255, 0.04);
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}

/* JS 代码语法高亮 */
.answer-body :deep(.k) { color: #ff7b72; }   /* keyword */
.answer-body :deep(.s) { color: #a5d6ff; }   /* string */
.answer-body :deep(.c) { color: #8b949e; font-style: italic; } /* comment */
.answer-body :deep(.f) { color: #d2a8ff; }   /* function */
.answer-body :deep(.n) { color: #ffa657; }   /* number */
.answer-body :deep(.o) { color: #79c0ff; }   /* operator */
.answer-body :deep(.p) { color: #c9d1d9; }   /* punctuation */
.answer-body :deep(.t) { color: #7ee787; }   /* type/class */

/* 表格 */
.answer-body :deep(table) {
  width: 100%;
  margin: var(--space-5) 0;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.answer-body :deep(th) {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-weight: 600;
  color: #e2e8f0;
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid var(--color-border-dark);
  white-space: nowrap;
}

.answer-body :deep(td) {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border-dark);
  color: var(--color-text-inverse-secondary);
}

.answer-body :deep(tr:nth-child(even) td) {
  background: rgba(255, 255, 255, 0.02);
}

/* 列表 */
.answer-body :deep(ol),
.answer-body :deep(ul) {
  margin: var(--space-4) 0;
  padding-left: var(--space-6);
}

.answer-body :deep(li) {
  margin-bottom: var(--space-2);
  line-height: 1.7;
}

/* 引用块 */
.answer-body :deep(blockquote) {
  margin: var(--space-5) 0;
  padding: var(--space-4) var(--space-5);
  border-left: 3px solid var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.05);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--color-text-inverse-secondary);
  font-style: italic;
}

/* 分隔线 */
.answer-body :deep(hr) {
  margin: var(--space-8) 0;
  border: none;
  border-top: 1px solid var(--color-border-dark);
}

/* 流程图的 ASCII art 区域 */
.answer-body :deep(.flow-chart) {
  display: block;
  margin: var(--space-5) 0;
  padding: var(--space-5);
  background: #0d0d24;
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--color-text-inverse-tertiary);
  overflow-x: auto;
  white-space: pre;
}

/* YAML 代码块 */
.answer-body :deep(pre code.language-yaml) {
  color: #c9d1d9;
}

/* ===== 底部导航 ===== */
.article-footer-nav {
  margin-top: var(--space-12);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border-dark);
  text-align: center;
}

.footer-back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: var(--radius-full);
  transition: all 0.2s ease;
}

.footer-back-link:hover {
  color: #fff;
  background: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.4);
}

/* ===== 响应式 - 768px 断点 ===== */
@media (max-width: 768px) {
  .article-hero {
    padding: var(--space-8) var(--space-4) var(--space-6);
  }

  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .hero-desc {
    font-size: var(--font-size-sm);
  }

  /* 隐藏桌面目录，显示移动端折叠目录 */
  .article-toc-desktop {
    display: none;
  }

  .article-toc-mobile {
    display: block;
    margin-bottom: var(--space-6);
  }

  .toc-mobile-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-5);
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: #e2e8f0;
    background: var(--color-bg-dark-secondary);
    border: 1px solid var(--color-border-dark);
    border-radius: var(--radius-lg);
    cursor: pointer;
    list-style: none;
    user-select: none;
  }

  .toc-mobile-summary::-webkit-details-marker {
    display: none;
  }

  .toc-mobile-arrow {
    font-size: 10px;
    color: var(--color-text-inverse-tertiary);
    transition: transform 0.2s ease;
  }

  details[open] .toc-mobile-arrow {
    transform: rotate(180deg);
  }

  .toc-mobile-nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    padding: var(--space-4);
    margin-top: var(--space-1);
    background: var(--color-bg-dark-secondary);
    border: 1px solid var(--color-border-dark);
    border-radius: var(--radius-lg);
  }

  .toc-mobile-link {
    padding: var(--space-1) var(--space-3);
    font-size: var(--font-size-xs);
    color: var(--color-text-inverse-tertiary);
    background: rgba(255, 255, 255, 0.03);
    border-radius: var(--radius-full);
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .toc-mobile-link:hover {
    color: var(--color-accent-cyan);
    background: rgba(6, 182, 212, 0.1);
  }

  .article-body {
    flex-direction: column;
    padding: 0 var(--space-4);
    margin-top: var(--space-6);
  }

  .section-heading {
    font-size: var(--font-size-xl);
  }

  .question-heading {
    font-size: var(--font-size-base);
  }

  .answer-body {
    font-size: var(--font-size-sm);
  }

  .answer-body :deep(pre) {
    padding: var(--space-4);
    font-size: var(--font-size-xs);
    margin: var(--space-4) -var(--space-4);
    border-radius: 0;
    border-left: none;
    border-right: none;
  }

  .answer-body :deep(pre code) {
    font-size: var(--font-size-xs);
  }

  .answer-body :deep(table) {
    font-size: var(--font-size-xs);
    display: block;
    overflow-x: auto;
  }

  .answer-body :deep(th),
  .answer-body :deep(td) {
    padding: var(--space-2) var(--space-3);
  }
}

/* ===== 响应式 - 480px 断点 ===== */
@media (max-width: 480px) {
  .article-hero {
    padding: var(--space-6) var(--space-3) var(--space-4);
  }

  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-desc {
    font-size: var(--font-size-xs);
  }

  .hero-meta {
    flex-wrap: wrap;
    font-size: var(--font-size-xs);
  }

  .article-body {
    padding: 0 var(--space-3);
    margin-top: var(--space-4);
  }

  .section-heading {
    font-size: var(--font-size-lg);
  }

  .question-heading {
    font-size: var(--font-size-sm);
    padding-left: var(--space-2);
  }

  .answer-body {
    font-size: var(--font-size-xs);
    line-height: 1.75;
  }

  .answer-body :deep(pre) {
    padding: var(--space-3);
    margin: var(--space-3) -var(--space-3);
  }

  .answer-body :deep(pre code) {
    font-size: 11px;
  }

  .content-section {
    margin-bottom: var(--space-8);
  }

  .footer-back-link {
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
  }
}
</style>
