<template>
  <div class="timeline-page">
    <!-- Hero 标题区 -->
    <section class="timeline-hero">
      <h1 class="hero-title">时间线</h1>
      <p class="hero-subtitle">记录成长轨迹，每一步都算数</p>
      <div class="hero-scroll-hint">
        <span class="scroll-arrow"></span>
      </div>
    </section>

    <!-- 时间线主体 -->
    <div class="timeline-container" ref="timelineContainer">
      <!-- 阶段一：2019 — 2022 -->
      <div class="stage-divider stage-divider--one">
        <span class="stage-icon">◆</span>
        <span class="stage-label">2019 — 2022</span>
        <span class="stage-icon">◆</span>
      </div>
      <div
        v-for="exp in stageOne"
        :key="exp.id"
        class="timeline-node"
      >
        <time class="node-date">{{ exp.date }}</time>
        <div class="node-dot"></div>
        <div class="node-card">
          <div class="card-header">
            <h3 class="card-company">{{ exp.company }}</h3>
            <span class="card-position">{{ exp.position }}</span>
          </div>
          <div class="card-projects">
            <div
              v-for="proj in exp.projects"
              :key="proj.name"
              class="project-item"
            >
              <div class="project-head">
                <h4 class="project-name">{{ proj.name }}</h4>
                <span class="project-period">{{ proj.period }}</span>
              </div>
              <p class="project-desc">{{ proj.description }}</p>
              <ul v-if="proj.highlights.length" class="project-highlights">
                <li v-for="h in proj.highlights" :key="h">{{ h }}</li>
              </ul>
              <div class="project-tags">
                <span v-for="tag in proj.techStack" :key="tag" class="tech-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态占位 -->
      <div v-if="stageOne.length === 0" class="empty-stage">
        <p>暂无此阶段的经历记录</p>
      </div>

      <!-- 阶段二：2022 — 2026 -->
      <div class="stage-divider stage-divider--two">
        <span class="stage-icon">◆</span>
        <span class="stage-label">2022 — 2026</span>
        <span class="stage-icon">◆</span>
      </div>
      <div
        v-for="exp in stageTwo"
        :key="exp.id"
        class="timeline-node"
      >
        <time class="node-date">{{ exp.date }}</time>
        <div class="node-dot"></div>
        <div class="node-card">
          <div class="card-header">
            <h3 class="card-company">{{ exp.company }}</h3>
            <span class="card-position">{{ exp.position }}</span>
          </div>
          <div class="card-projects">
            <div
              v-for="proj in exp.projects"
              :key="proj.name"
              class="project-item"
            >
              <div class="project-head">
                <h4 class="project-name">{{ proj.name }}</h4>
                <span class="project-period">{{ proj.period }}</span>
              </div>
              <p class="project-desc">{{ proj.description }}</p>
              <ul v-if="proj.highlights.length" class="project-highlights">
                <li v-for="h in proj.highlights" :key="h">{{ h }}</li>
              </ul>
              <div class="project-tags">
                <span v-for="tag in proj.techStack" :key="tag" class="tech-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态占位 -->
      <div v-if="stageTwo.length === 0" class="empty-stage">
        <p>暂无此阶段的经历记录</p>
      </div>

      <!-- 底部终点标记 -->
      <div class="timeline-end">
        <div class="end-dot"></div>
        <span class="end-label">未完待续...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Experience } from './types/timeline'

gsap.registerPlugin(ScrollTrigger)

// ==================== 数据定义（用户可按需修改） ====================

/** 阶段一：2019 — 2022 教育 & 工作经历 */
const stageOne: Experience[] = [
  {
    id: 'edu-1',
    date: '2019.09',
    company: '江西冶金职业技术学院',
    position: '计算机网络技术 · 大专',
    projects: [
      {
        name: '专业课程学习',
        description: '系统学习计算机网络基础、前端开发技术，在校期间自学 HTML/CSS/JavaScript 并参与实际项目实践，为后续职业发展奠定技术基础。',
        highlights: ['掌握前端三大件 HTML/CSS/JS 核心基础', '自学 Vue 框架并完成个人练手项目', '在校期间开始接触实际企业项目'],
        techStack: ['HTML5', 'CSS3', 'JavaScript', 'Vue'],
        period: '2019.09 - 2021.06',
      },
    ],
  },
  {
    id: 'exp-1',
    date: '2020.07',
    company: '江西时励软件技术有限公司',
    position: '前端开发工程师',
    projects: [
      {
        name: '时励员工后台管理系统',
        description: '企业内部人事权限管理系统，搭建项目基础架构，实现精细化角色权限控制，封装统一请求拦截器，完成数据可视化与公共组件抽象。',
        highlights: [
          '从零搭建项目基础架构，制定标准化开发规范',
          '实现精细化角色权限控制，提升系统安全性',
          '封装统一请求拦截器与公共组件，提升团队研发效率',
          '主导性能优化，解决页面卡顿、渲染延迟等瓶颈',
        ],
        techStack: ['Vue', 'Element-UI', 'Vuex', 'ECharts'],
        period: '2020.07 - 2022.06',
      },
    ],
  },
]

/** 阶段二：2022 — 2026 工作经历 */
const stageTwo: Experience[] = [
  {
    id: 'exp-2',
    date: '2022.07',
    company: '深圳市诚讯德通信服务有限公司',
    position: '前端开发工程师',
    projects: [
      {
        name: '博通互联官网',
        description: '企业级官方展示与客户服务平台，支持 PC/H5 双端自适应。封装通用布局与业务组件，实现路由动态适配切换，集成在线客服系统。',
        highlights: ['PC/H5 双端自适应适配', '封装通用布局与业务组件库', '集成在线客服系统，提升客户对接效率'],
        techStack: ['Vue 3', 'TypeScript', 'Element-UI'],
        period: '2022.07 - 2026.03',
      },
      {
        name: '企尚 QISHANG 公众号',
        description: '设备信息查询服务公众号，从零搭建实名核验、充值缴费、设备查询、在线客服等核心能力。自定义操作引导流程与实名组件，对接多渠道支付。',
        highlights: ['从 0 到 1 独立搭建完整产品', '自定义实名核验组件与操作引导流程', '对接多渠道支付，全页面埋点数据分析', '优化登录兜底策略，提升用户转化率'],
        techStack: ['UniApp', 'Vue', '微信 SDK'],
        period: '2022.07 - 2026.03',
      },
      {
        name: '博通 IOT 后台管理系统',
        description: '物联网领域企业级管理平台，支撑卡片、设备、出入库、订单、店铺全流程管理。基于 ECharts 封装数据可视化模块，二次封装虚拟表格解决大数据渲染性能问题。',
        highlights: ['支撑卡片/设备/出入库/订单/店铺全流程管理', '基于 ECharts 封装数据可视化模块', '二次封装虚拟表格解决大数据渲染性能瓶颈', '模块化架构设计提升系统可扩展性'],
        techStack: ['Vue', 'View Design', 'ECharts', 'WebSocket'],
        period: '2022.07 - 2026.03',
      },
    ],
  },
]

// ==================== GSAP ScrollTrigger 动画 ====================

const timelineContainer = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()

  if (!timelineContainer.value) return

  // 1. 节点：第一个默认可见，其余从下方 150px 处上移入位
  const nodes = gsap.utils.toArray(timelineContainer.value!.querySelectorAll('.timeline-node')) as HTMLElement[]
  nodes.forEach((node, index) => {
    if (index === 0) return // 顶部第一个保持可见

    gsap.fromTo(
      node,
      { y: 150, opacity: 0.3 },
      {
        y: 0,
        opacity: 1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: node,
          start: 'top bottom-=80',
          end: 'top 45%',
          scrub: 1,
        },
      },
    )
  })

  // 2. 阶段分隔线：从下方上移 + blur 消散
  const dividers = gsap.utils.toArray(timelineContainer.value!.querySelectorAll('.stage-divider')) as HTMLElement[]
  dividers.forEach((div) => {
    gsap.fromTo(
      div,
      { y: 80, filter: 'blur(6px)', opacity: 0 },
      {
        y: 0,
        filter: 'blur(0px)',
        opacity: 1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: div,
          start: 'top bottom-=40',
          end: 'top 50%',
          scrub: 1,
        },
      },
    )
  })

  // 3. 底部终点：从下方上移
  const endEl = timelineContainer.value.querySelector('.timeline-end') as HTMLElement | null
  if (endEl) {
    gsap.fromTo(
      endEl,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: endEl,
          start: 'top bottom-=20',
          end: 'top 55%',
          scrub: 1,
        },
      },
    )
  }

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill())
})
</script>

<style scoped>
/* ==================== 页面容器 ==================== */
.timeline-page {
  min-height: 100vh;
  background: var(--color-bg-dark);
  color: #fff;
}

/* ==================== Hero 标题区 ==================== */
.timeline-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
  padding: var(--space-16) var(--space-6) var(--space-10);
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

.hero-subtitle {
  margin-top: var(--space-4);
  font-size: var(--font-size-lg);
  color: var(--color-text-inverse-secondary);
  max-width: 400px;
}

/* 滚动提示箭头 */
.hero-scroll-hint {
  margin-top: var(--space-10);
  animation: bounce-down 2s ease-in-out infinite;
}

.scroll-arrow {
  display: block;
  width: 24px;
  height: 24px;
  border-right: 2px solid var(--color-text-inverse-tertiary);
  border-bottom: 2px solid var(--color-text-inverse-tertiary);
  transform: rotate(45deg);
  opacity: 0.6;
}

@keyframes bounce-down {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

/* ==================== 时间线容器 ==================== */
.timeline-container {
  position: relative;
  max-width: 860px;
  margin: 0 auto;
  padding: 0 var(--space-6) var(--space-16);
}

/* ==================== 阶段分隔线 ==================== */
.stage-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-10) 0 var(--space-6);
  padding-left: 125px;
}

.stage-icon {
  color: var(--color-accent-cyan);
  font-size: 10px;
  text-shadow: 0 0 8px rgba(6, 182, 212, 0.6);
}

.stage-label {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 0.05em;
}

/* ==================== 时间节点 ==================== */
.timeline-node {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--space-10);
  position: relative;
}

/* 日期标签 */
.node-date {
  width: 90px;
  flex-shrink: 0;
  text-align: right;
  padding-right: 28px;
  padding-top: 4px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-accent-cyan);
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

/* 圆点 */
.node-dot {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--color-bg-dark);
  border: 3px solid var(--color-accent-cyan);
  box-shadow:
    0 0 10px rgba(6, 182, 212, 0.4),
    inset 0 0 4px rgba(6, 182, 212, 0.2);
  margin-top: 6px;
  position: relative;
  z-index: 1;
  transition: box-shadow 0.3s ease, background 0.3s ease;
}

/* 圆点 hover 发光增强 */
.timeline-node:hover .node-dot {
  background: var(--color-accent-cyan);
  box-shadow:
    0 0 16px rgba(6, 182, 212, 0.7),
    0 0 32px rgba(6, 182, 212, 0.3);
}

/* ==================== 经历卡片 ==================== */
.node-card {
  flex: 1;
  margin-left: 28px;
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    border-color 0.3s ease;
}

.node-card:hover {
  transform: translateY(-4px);
  border-color: rgba(6, 182, 212, 0.3);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.4),
    0 0 1px rgba(6, 182, 212, 0.3);
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.card-company {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: #e2e8f0;
}

.card-position {
  font-size: var(--font-size-sm);
  color: var(--color-accent);
  background: rgba(59, 130, 246, 0.12);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}

/* 项目列表 */
.card-projects {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.project-item {
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.project-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
  flex-wrap: wrap;
}

.project-name {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #cbd5e1;
}

.project-period {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
  font-family: var(--font-mono);
  white-space: nowrap;
}

.project-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-2);
}

/* 项目亮点 */
.project-highlights {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-3);
}

.project-highlights li {
  position: relative;
  padding-left: 16px;
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
  line-height: 1.8;
}

.project-highlights li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--color-accent-cyan);
  font-size: 10px;
}

/* 技术标签 */
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tech-tag {
  padding: 3px 10px;
  font-size: var(--font-size-xs);
  color: var(--color-accent-cyan);
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: var(--radius-full);
  transition: background 0.2s ease, border-color 0.2s ease;
}

.tech-tag:hover {
  background: rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.4);
}

/* ==================== 空状态 ==================== */
.empty-stage {
  padding: var(--space-8) var(--space-6);
  padding-left: 160px;
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
  font-style: italic;
}

/* ==================== 底部终点 ==================== */
.timeline-end {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-left: 125px;
  padding-top: var(--space-8);
}

.end-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-accent-cyan);
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.6);
  animation: end-pulse 2s ease-in-out infinite;
}

@keyframes end-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(6, 182, 212, 0.4); }
  50% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.8); }
}

.end-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
  font-style: italic;
}

/* ==================== 响应式：移动端 ==================== */
@media (max-width: 768px) {
  .timeline-hero {
    min-height: 30vh;
    padding: var(--space-10) var(--space-4) var(--space-6);
  }

  .hero-title {
    font-size: var(--font-size-3xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .timeline-node {
    flex-direction: column;
    padding-left: 0;
  }

  .node-date {
    width: auto;
    text-align: left;
    padding: 0 0 var(--space-1) 44px;
    font-size: var(--font-size-xs);
  }

  .node-dot {
    position: absolute;
    left: 17px;
    top: 2px;
  }

  .node-card {
    margin-left: 44px;
    padding: var(--space-4);
  }

  .stage-divider {
    padding-left: 24px;
    justify-content: flex-start;
  }

  .stage-label {
    font-size: var(--font-size-base);
  }

  .timeline-end {
    padding-left: 24px;
  }

  .project-head {
    flex-direction: column;
    gap: var(--space-1);
  }

  .card-header {
    flex-direction: column;
    gap: var(--space-1);
  }
}

@media (max-width: 480px) {
  .timeline-hero {
    min-height: 25vh;
    padding: var(--space-8) var(--space-4) var(--space-4);
  }

  .hero-title {
    font-size: var(--font-size-2xl);
  }

  .hero-subtitle {
    font-size: var(--font-size-sm);
    max-width: 280px;
  }

  .timeline-container {
    padding: 0 var(--space-4) var(--space-10);
  }

  .node-dot {
    left: 12px;
  }

  .node-date {
    padding-left: 36px;
  }

  .node-card {
    margin-left: 36px;
    padding: var(--space-3);
  }

  .stage-divider {
    padding-left: 16px;
  }

  .stage-label {
    font-size: var(--font-size-sm);
  }

  .timeline-end {
    padding-left: 16px;
  }

  .card-company {
    font-size: var(--font-size-base);
  }

  .card-position {
    font-size: var(--font-size-xs);
  }

  .project-name {
    font-size: var(--font-size-sm);
  }

  .project-desc {
    font-size: var(--font-size-xs);
  }

  .project-highlights li {
    font-size: var(--font-size-xs);
  }

  .tech-tag {
    padding: 2px 8px;
    font-size: 11px;
  }

  .empty-stage {
    padding-left: 52px;
  }
}
</style>
