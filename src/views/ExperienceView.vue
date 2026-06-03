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
          <div class="stat-item">
            <span class="stat-num">5+</span>
            <span class="stat-label">年经验</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">12</span>
            <span class="stat-label">核心功能</span>
          </div>
          <div class="stat-item">
            <span class="stat-num">3</span>
            <span class="stat-label">产品线</span>
          </div>
        </div>

        <!-- 技能标签云 -->
        <div class="hero-skills">
          <span class="skill-pill">Vue 3</span>
          <span class="skill-pill">TypeScript</span>
          <span class="skill-pill">UniApp</span>
          <span class="skill-pill">微信 SDK</span>
          <span class="skill-pill">支付对接</span>
          <span class="skill-pill">ECharts</span>
          <span class="skill-pill">Element-UI</span>
          <span class="skill-pill">View Design</span>
          <span class="skill-pill">实名认证</span>
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
          <div class="footer-group">
            <h3 class="group-label">前端框架</h3>
            <div class="group-tags">
              <span class="g-tag">Vue 2/3</span>
              <span class="g-tag">TypeScript</span>
              <span class="g-tag">UniApp</span>
              <span class="g-tag">Vite</span>
            </div>
          </div>
          <div class="footer-group">
            <h3 class="group-label">UI 框架</h3>
            <div class="group-tags">
              <span class="g-tag">Element-UI</span>
              <span class="g-tag">View Design</span>
              <span class="g-tag">Ant Design Vue</span>
            </div>
          </div>
          <div class="footer-group">
            <h3 class="group-label">微信生态</h3>
            <div class="group-tags">
              <span class="g-tag">公众号 JSSDK</span>
              <span class="g-tag">小程序 API</span>
              <span class="g-tag">微信支付</span>
              <span class="g-tag">支付宝支付</span>
            </div>
          </div>
          <div class="footer-group">
            <h3 class="group-label">工程化 & 其他</h3>
            <div class="group-tags">
              <span class="g-tag">Git</span>
              <span class="g-tag">CI/CD</span>
              <span class="g-tag">ECharts</span>
              <span class="g-tag">Canvas</span>
              <span class="g-tag">Node.js</span>
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

gsap.registerPlugin(ScrollTrigger)

// ==================== 功能数据 ====================
interface FeatureItem {
  id: string
  name: string
  description: string
  tags: string[]
  icon: string
  color: string
}

const features: FeatureItem[] = [
  {
    id: 'f01',
    name: 'HTML Canvas 海报生成',
    description: '基于 Canvas 实现自定义海报绘制，支持上传照片、编辑文字、选择模板，一键生成并保存分享海报。',
    tags: ['Canvas', 'HTML5', 'JavaScript'],
    icon: '▣',
    color: 'linear-gradient(135deg, #f472b6, #a78bfa)',
  },
  {
    id: 'f02',
    name: '公众号埋点监控',
    description: '公众号全页面埋点数据采集与分析，追踪用户行为路径、页面停留时长，输出转化漏斗与数据看板。',
    tags: ['埋点SDK', '数据分析', '公众号'],
    icon: '◉',
    color: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  },
  {
    id: 'f03',
    name: '小程序一键获取手机号',
    description: '对接微信一键授权获取手机号，实现免密登录与手机号绑定，优化注册转化流程。',
    tags: ['微信小程序', '授权登录', '手机号'],
    icon: '◎',
    color: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  },
  {
    id: 'f04',
    name: '小程序跳转实名认证',
    description: '公众号跳转微信小程序，拉起第三方实名认证流程，完成身份核验后结果回传业务系统。',
    tags: ['小程序跳转', '实名认证', '公众号'],
    icon: '◈',
    color: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    id: 'f05',
    name: '公众号实名认证',
    description: '自建公众号实名认证流程，对接运营商三要素核验，支持身份证 OCR 识别与活体检测。',
    tags: ['实名认证', 'OCR', '活体检测'],
    icon: '◆',
    color: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    id: 'f06',
    name: '微信支付',
    description: '集成微信 JSAPI 支付、H5 支付、小程序支付，覆盖充值、缴费、订单等场景与退款对账全流程。',
    tags: ['微信支付', 'JSAPI', '支付回调'],
    icon: '◇',
    color: 'linear-gradient(135deg, #10b981, #34d399)',
  },
  {
    id: 'f07',
    name: '支付宝支付',
    description: '接入支付宝 PC 网站支付与 H5 支付，实现多渠道支付统一管理与支付路由降级策略。',
    tags: ['支付宝', 'H5支付', '支付路由'],
    icon: '◈',
    color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
  {
    id: 'f08',
    name: '管理平台轮询扫码支付',
    description: '后台生成支付二维码，前端轮询支付状态，成功后自动更新订单并触发后续业务流程。',
    tags: ['轮询', '扫码支付', '订单管理'],
    icon: '▣',
    color: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  },
  {
    id: 'f09',
    name: 'RBAC 权限管理',
    description: '基于角色的访问控制体系，用户-角色-权限三级管理，动态路由过滤，按钮级权限控制。',
    tags: ['RBAC', '权限控制', '动态路由'],
    icon: '▥',
    color: 'linear-gradient(135deg, #ef4444, #f97316)',
  },
  {
    id: 'f10',
    name: 'ECharts 数据可视化',
    description: '封装 ECharts 图表组件库，支持折线/柱状/饼图/仪表盘等多种类型，实现业务数据可视化。',
    tags: ['ECharts', '数据可视化', '组件封装'],
    icon: '◉',
    color: 'linear-gradient(135deg, #06b6d4, #f59e0b)',
  },
  {
    id: 'f11',
    name: '虚拟滚动表格',
    description: '二次封装高性能虚拟滚动表格组件，仅渲染可视区域数据行，解决大数据量渲染性能瓶颈。',
    tags: ['虚拟滚动', '性能优化', '组件封装'],
    icon: '▦',
    color: 'linear-gradient(135deg, #6366f1, #a78bfa)',
  },
  {
    id: 'f12',
    name: 'PC/H5 双端自适应官网',
    description: '搭建企业级官网，PC 与 H5 双端自适应响应式布局，封装通用组件库，集成在线客服系统。',
    tags: ['响应式', 'Vue 3', '组件库'],
    icon: '▤',
    color: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  },
]

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

  // 2. 卡片掉落：从右上角旋转掉落
  const cards = gsap.utils.toArray(section.querySelectorAll('.exp-card')) as HTMLElement[]
  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { y: -200, rotation: 15, opacity: 0, scale: 0.85 },
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
  color: #fff;
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
  color: #e2e8f0;
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
  color: #e2e8f0;
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
  color: #e2e8f0;
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
  color: #e2e8f0;
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
</style>
