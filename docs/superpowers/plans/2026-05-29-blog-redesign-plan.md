# 私人博客改造实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有 Vue3 练手项目改造为深色科技风私人博客，包含星空首页（4 个动效板块）+ 5 个导航页 + 练手独立入口。

**Architecture:** 路由拆分为博客首页(/)和占位页(/timeline, /articles, /experience, /friends)及练手子路由(/practice/*)。组件按 common（全局）和 blog（首页专用）分层。首页使用 GSAP scrollTrigger 驱动逐板块渐入，星空和鼠标拖尾用纯 CSS/Canvas 实现。

**Tech Stack:** Vue 3 + TypeScript + Vite 7 + Pinia + Vue Router + GSAP + Canvas API

---

## 文件清单

### 新建文件

| 文件 | 职责 |
|------|------|
| `src/components/blog/StarryBackground.vue` | 纯 CSS 星空背景（多层 box-shadow 动画） |
| `src/components/blog/MouseTrail.vue` | Canvas 鼠标粒子拖尾 |
| `src/components/blog/ScrollReveal.vue` | GSAP scrollTrigger 渐入容器 |
| `src/components/blog/MusicPlayer.vue` | 音乐播放 + CSS 跳动频谱动画 |
| `src/components/blog/TypeWriter.vue` | 打字机逐字输出效果 |
| `src/components/blog/SectionCard.vue` | 通用卡片容器 |
| `src/components/common/AppNavbar.vue` | 顶部导航栏（含"更多"下拉） |
| `src/components/common/AppFooter.vue` | 底部页脚 |
| `src/views/BlogHome.vue` | 博客首页，组装所有板块 |
| `src/views/TimelineView.vue` | 时间线（占位） |
| `src/views/ArticlesView.vue` | 文章（占位） |
| `src/views/ExperienceView.vue` | 经历（占位） |
| `src/views/FriendsView.vue` | 友链（占位） |

### 修改文件

| 文件 | 改动 |
|------|------|
| `index.html` | 更新 title |
| `src/assets/base.css` | 扩展深色主题 CSS 变量 |
| `src/router/index.ts` | 重构路由，新增博客和练手分组 |
| `src/App.vue` | 替换为新的 AppNavbar + AppFooter，深色背景 |

---

### Task 1: 安装 GSAP 依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装 GSAP**

```bash
npm install gsap
```

- [ ] **Step 2: 验证安装**

```bash
node -e "const g = require('gsap'); console.log('GSAP OK')"
```

Expected: `GSAP OK`

- [ ] **Step 3: 提交**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add gsap for scroll animations"
```

---

### Task 2: 扩展 CSS 变量体系

**Files:**
- Modify: `src/assets/base.css`

- [ ] **Step 1: 在 `:root` 选择器末尾添加深色主题 Token**

在 `src/assets/base.css` 的 `:root` 块末尾（`}` 闭合之前）追加：

```css
  /* Dark theme tokens */
  --color-bg-dark: #0a0a1a;
  --color-bg-dark-secondary: #0f0f2a;
  --color-bg-dark-tertiary: #151535;
  --color-text-inverse-secondary: #8892b0;
  --color-text-inverse-tertiary: #495670;
  --color-accent: #3b82f6;
  --color-accent-cyan: #06b6d4;
  --color-border-dark: rgba(255, 255, 255, 0.08);
```

- [ ] **Step 2: 提交**

```bash
git add src/assets/base.css
git commit -m "style: add dark theme CSS tokens for blog layout"
```

---

### Task 3: StarryBackground 组件

**Files:**
- Create: `src/components/blog/StarryBackground.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <div class="starry-bg" ref="container">
    <div class="stars stars-small"></div>
    <div class="stars stars-medium"></div>
    <div class="stars stars-large"></div>
    <div class="shooting-star" v-for="i in 3" :key="i" :style="shootingStyle(i)"></div>
  </div>
</template>

<script setup lang="ts">
function shootingStyle(i: number) {
  const top = 10 + i * 25 + Math.random() * 15
  const delay = i * 4 + Math.random() * 3
  const left = 20 + i * 20 + Math.random() * 30
  return {
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${2 + Math.random() * 2}s`
  }
}
</script>

<style scoped>
.starry-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.stars {
  position: absolute;
  inset: 0;
}

.stars-small {
  background-image:
    radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 40% 8%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 55% 42%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 70% 18%, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 15% 70%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 60% 65%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 90% 85%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 8% 50%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 48% 78%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 75% 72%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 22% 22%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 93% 10%, rgba(255,255,255,0.8), transparent);
  animation: twinkle 4s ease-in-out infinite alternate;
}

.stars-medium {
  background-image:
    radial-gradient(2px 2px at 18% 25%, rgba(180,200,255,0.8), transparent),
    radial-gradient(2px 2px at 50% 12%, rgba(255,255,255,0.9), transparent),
    radial-gradient(2px 2px at 72% 38%, rgba(180,200,255,0.7), transparent),
    radial-gradient(2px 2px at 33% 58%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 88% 70%, rgba(180,200,255,0.6), transparent),
    radial-gradient(2px 2px at 12% 82%, rgba(255,255,255,0.7), transparent),
    radial-gradient(2px 2px at 62% 85%, rgba(180,200,255,0.8), transparent),
    radial-gradient(2px 2px at 45% 45%, rgba(255,255,255,0.5), transparent);
  animation: twinkle 5s ease-in-out infinite alternate-reverse;
}

.stars-large {
  background-image:
    radial-gradient(3px 3px at 30% 20%, rgba(200,220,255,0.9), transparent),
    radial-gradient(3px 3px at 65% 30%, rgba(255,255,255,0.7), transparent),
    radial-gradient(3px 3px at 80% 60%, rgba(200,220,255,0.8), transparent),
    radial-gradient(3px 3px at 15% 45%, rgba(255,255,255,0.6), transparent),
    radial-gradient(3px 3px at 55% 75%, rgba(200,220,255,0.7), transparent);
  animation: twinkle 6s ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

.shooting-star {
  position: absolute;
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.8), transparent);
  border-radius: 50%;
  animation: shoot linear infinite;
  opacity: 0;
}

@keyframes shoot {
  0% {
    opacity: 0;
    transform: translateX(0) translateY(0) rotate(-35deg);
  }
  5% {
    opacity: 1;
  }
  10% {
    opacity: 0;
    transform: translateX(-200px) translateY(100px) rotate(-35deg);
  }
  100% {
    opacity: 0;
    transform: translateX(-200px) translateY(100px) rotate(-35deg);
  }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/blog/StarryBackground.vue
git commit -m "feat(components): add CSS starry background with twinkle and shooting stars"
```

---

### Task 4: MouseTrail 组件

**Files:**
- Create: `src/components/blog/MouseTrail.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <canvas ref="canvas" class="mouse-trail-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }> = []
let mouseX = -100
let mouseY = -100
let rafId = 0

function resize() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
  for (let i = 0; i < 2; i++) {
    particles.push({
      x: mouseX + (Math.random() - 0.5) * 10,
      y: mouseY + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 0,
      maxLife: 30 + Math.random() * 30,
      size: 1 + Math.random() * 2.5
    })
  }
}

function animate() {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  particles = particles.filter(p => p.life < p.maxLife)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.life++
    const alpha = 1 - p.life / p.maxLife
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.7})`
    ctx.fill()
  }
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouseMove)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.mouse-trail-canvas {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/blog/MouseTrail.vue
git commit -m "feat(components): add canvas mouse trail particle effect"
```

---

### Task 5: ScrollReveal 组件

**Files:**
- Create: `src/components/blog/ScrollReveal.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <div ref="el" :class="['scroll-reveal', { revealed: isRevealed }]" :style="{ transitionDelay: `${delay}ms` }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps<{ delay?: number }>()

const el = ref<HTMLElement | null>(null)
const isRevealed = ref(false)
let st: ScrollTrigger | null = null

onMounted(() => {
  if (!el.value) return
  st = ScrollTrigger.create({
    trigger: el.value,
    start: 'top 85%',
    onEnter: () => { isRevealed.value = true },
    once: true
  })
})

onUnmounted(() => {
  st?.kill()
})
</script>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/blog/ScrollReveal.vue
git commit -m "feat(components): add GSAP ScrollTrigger reveal wrapper"
```

---

### Task 6: MusicPlayer 组件

**Files:**
- Create: `src/components/blog/MusicPlayer.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <ScrollReveal>
    <div class="music-player">
      <div class="music-spectrum">
        <span v-for="i in 16" :key="i" class="bar" :style="barStyle(i)" :class="{ playing: isPlaying }"></span>
      </div>
      <button class="music-btn" @click="toggle">
        <span v-if="!isPlaying">▶ 播放音乐</span>
        <span v-else>⏸ 暂停</span>
      </button>
      <audio ref="audio" loop :src="audioSrc" @error="onError"></audio>
    </div>
  </ScrollReveal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScrollReveal from './ScrollReveal.vue'

const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)
const hasError = ref(false)

const audioSrc = ''

function barStyle(i: number) {
  const h = 12 + Math.sin(i * 0.7) * 20 + Math.random() * 8
  return { height: `${h}px`, animationDelay: `${i * 0.12}s` }
}

function toggle() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play().catch(() => { hasError.value = true })
  }
  isPlaying.value = !isPlaying.value
}

function onError() {
  hasError.value = true
}
</script>

<style scoped>
.music-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 60px 0;
}

.music-spectrum {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 60px;
}

.bar {
  width: 4px;
  border-radius: 2px;
  background: var(--color-accent);
  transition: height 0.2s ease;
}

.bar.playing {
  animation: bounce 0.8s ease-in-out infinite alternate;
}

@keyframes bounce {
  0% { transform: scaleY(0.4); background: var(--color-accent); }
  100% { transform: scaleY(1); background: var(--color-accent-cyan); }
}

.music-btn {
  padding: 10px 28px;
  border: 1px solid var(--color-accent);
  border-radius: 24px;
  color: var(--color-accent);
  font-size: 14px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.music-btn:hover {
  background: var(--color-accent);
  color: #fff;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/blog/MusicPlayer.vue
git commit -m "feat(components): add music player with CSS bouncing spectrum"
```

---

### Task 7: TypeWriter 组件

**Files:**
- Create: `src/components/blog/TypeWriter.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <ScrollReveal>
    <div class="typewriter">
      <p class="typewriter-text">
        <span class="typed">{{ displayedText }}</span>
        <span class="cursor" :class="{ blink: done }">|</span>
      </p>
    </div>
  </ScrollReveal>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ScrollReveal from './ScrollReveal.vue'

const props = withDefaults(defineProps<{ text?: string; speed?: number }>(), {
  text: '长风破浪会有时，直挂云帆济沧海。',
  speed: 120
})

const displayedText = ref('')
const done = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  let i = 0
  timer = setInterval(() => {
    if (i < props.text.length) {
      displayedText.value += props.text[i]
      i++
    } else {
      done.value = true
      if (timer) clearInterval(timer)
    }
  }, props.speed)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.typewriter {
  text-align: center;
  padding: 60px 0;
}

.typewriter-text {
  font-size: 24px;
  color: var(--color-text-inverse-secondary);
  letter-spacing: 0.05em;
  font-family: var(--font-sans);
}

.typed {
  color: #e2e8f0;
}

.cursor {
  color: var(--color-accent);
  font-weight: 300;
}

.cursor.blink {
  animation: blink-cursor 0.8s step-end infinite;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/blog/TypeWriter.vue
git commit -m "feat(components): add typewriter text effect component"
```

---

### Task 8: SectionCard 组件

**Files:**
- Create: `src/components/blog/SectionCard.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <ScrollReveal :delay="delay">
    <div class="section-card">
      <slot></slot>
    </div>
  </ScrollReveal>
</template>

<script setup lang="ts">
import ScrollReveal from './ScrollReveal.vue'

withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })
</script>

<style scoped>
.section-card {
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/blog/SectionCard.vue
git commit -m "feat(components): add reusable section card wrapper"
```

---

### Task 9: AppNavbar 组件

**Files:**
- Create: `src/components/common/AppNavbar.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <header class="blog-navbar">
    <div class="blog-navbar-inner">
      <RouterLink to="/" class="blog-brand">Garvey's Blog</RouterLink>

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
```

- [ ] **Step 2: 提交**

```bash
git add src/components/common/AppNavbar.vue
git commit -m "feat(components): add blog navbar with dropdown for practice pages"
```

---

### Task 10: AppFooter 组件

**Files:**
- Create: `src/components/common/AppFooter.vue`

- [ ] **Step 1: 创建组件**

```vue
<template>
  <footer class="blog-footer">
    <p>Built with Vue 3 + TypeScript. © 2026 Garvey's Blog</p>
  </footer>
</template>

<style scoped>
.blog-footer {
  text-align: center;
  padding: var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
  border-top: 1px solid var(--color-border-dark);
  background: var(--color-bg-dark);
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/common/AppFooter.vue
git commit -m "feat(components): add blog footer"
```

---

### Task 11: 博客首页 BlogHome.vue

**Files:**
- Create: `src/views/BlogHome.vue`

- [ ] **Step 1: 创建页面**

```vue
<template>
  <div class="blog-home">
    <StarryBackground />
    <MouseTrail />

    <!-- Hero -->
    <section class="blog-hero">
      <div class="blog-hero-content">
        <h1 class="hero-title">Garvey's Blog</h1>
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
import StarryBackground from '@/components/blog/StarryBackground.vue'
import MouseTrail from '@/components/blog/MouseTrail.vue'
import MusicPlayer from '@/components/blog/MusicPlayer.vue'
import TypeWriter from '@/components/blog/TypeWriter.vue'
import SectionCard from '@/components/blog/SectionCard.vue'

const articles: Array<{ id: number; date: string; title: string; excerpt: string }> = []

function scrollDown() {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
}
</script>

<style scoped>
.blog-home {
  position: relative;
  min-height: 100vh;
  background: var(--color-bg-dark);
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
  background: linear-gradient(135deg, #fff 30%, var(--color-accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
</style>
```

- [ ] **Step 2: 提交**

```bash
git add src/views/BlogHome.vue
git commit -m "feat(views): add blog home page with all sections"
```

---

### Task 12: 四个占位页面

**Files:**
- Create: `src/views/TimelineView.vue`
- Create: `src/views/ArticlesView.vue`
- Create: `src/views/ExperienceView.vue`
- Create: `src/views/FriendsView.vue`

- [ ] **Step 1: 创建四个占位页面（内容完全一致，替换 title）**

**TimelineView.vue:**

```vue
<template>
  <div class="placeholder-page">
    <h1>时间线</h1>
    <p>即将上线，敬请期待...</p>
  </div>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--color-text-inverse-secondary);
  background: var(--color-bg-dark);
}
.placeholder-page h1 {
  font-size: var(--font-size-3xl);
  color: #fff;
  margin-bottom: var(--space-4);
}
</style>
```

**ArticlesView.vue:** （同上，`<h1>` 改为"文章"）

**ExperienceView.vue:** （同上，`<h1>` 改为"经历"）

**FriendsView.vue:** （同上，`<h1>` 改为"友链"）

- [ ] **Step 2: 提交**

```bash
git add src/views/TimelineView.vue src/views/ArticlesView.vue src/views/ExperienceView.vue src/views/FriendsView.vue
git commit -m "feat(views): add placeholder pages for timeline, articles, experience, friends"
```

---

### Task 13: 重构路由

**Files:**
- Modify: `src/router/index.ts`

- [ ] **Step 1: 重写路由文件**

```typescript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'blog-home',
      component: () => import('../views/BlogHome.vue'),
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('../views/TimelineView.vue'),
    },
    {
      path: '/articles',
      name: 'articles',
      component: () => import('../views/ArticlesView.vue'),
    },
    {
      path: '/experience',
      name: 'experience',
      component: () => import('../views/ExperienceView.vue'),
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('../views/FriendsView.vue'),
    },
    {
      path: '/practice/home',
      name: 'practice-home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/practice/about',
      name: 'practice-about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/practice/modal',
      name: 'practice-modal',
      component: () => import('../views/ModalDemo.vue'),
    },
  ],
})

export default router
```

- [ ] **Step 2: 提交**

```bash
git add src/router/index.ts
git commit -m "refactor(router): restructure routes for blog + practice pages"
```

---

### Task 14: 更新 App.vue

**Files:**
- Modify: `src/App.vue`

- [ ] **Step 1: 重写 App.vue，使用新导航和页脚**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppNavbar from '@/components/common/AppNavbar.vue'
import AppFooter from '@/components/common/AppFooter.vue'

const route = useRoute()

const isPractice = computed(() => route.path.startsWith('/practice'))
</script>

<template>
  <div class="app-shell" :class="{ 'practice-mode': isPractice }">
    <AppNavbar />
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
```

- [ ] **Step 2: 提交**

```bash
git add src/App.vue
git commit -m "refactor(app): use new blog navbar and footer, practice pages keep light theme"
```

---

### Task 15: 更新 index.html 标题

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 修改 title**

```html
<title>Garvey's Blog</title>
```

- [ ] **Step 2: 提交**

```bash
git add index.html
git commit -m "chore: update page title to Garvey's Blog"
```

---

### Task 16: 验证构建

**Files:** 无（仅命令验证）

- [ ] **Step 1: 运行 dev server 检查**

```bash
npm run dev
```

检查：
- http://localhost:5173/ 显示博客首页（星空 + Hero + 音乐 + 诗词 + 文章 + 简介）
- 导航栏切换正常，下拉菜单出现
- /practice/home 等练手页面正常工作
- 浏览器控制台无报错

- [ ] **Step 2: 运行 build 检查**

```bash
npm run build
```

Expected: 构建成功，无 TS 或构建错误。

- [ ] **Step 3: 提交（如有修复）并推送**

```bash
git add -A
git commit -m "fix: resolve build issues"  # 如有
git push
```
