# 时间线页面设计文档

**日期**: 2026-06-03
**状态**: 设计中

## 1. 需求概述

在博客中新增一个垂直时间线页面（`/timeline`），展示从 2019 年至今的个人经历时间轴。路由和导航入口已存在，当前为占位页面。

### 核心要求

- 竖线贯穿的时间轴，卡片统一在竖线右侧
- 时间范围：2019.06 → 2026
- 精确到月份（如 `2019.06`、`2020.03`）
- 使用 GSAP ScrollTrigger 驱动滚动渐显动画
- 两个经历阶段：2019-2022、2022-2026
- 每个经历卡片包含：公司、职位、项目名称、描述、成果亮点、技术栈标签、在职时间段

## 2. 架构设计

### 页面组件树

```
TimelineView.vue                ← 页面容器，管理数据
├── TimelineHero.vue            ← 顶部标题区，淡入动画
├── TimelineVerticalBar.vue     ← 中间竖线，ScrollTrigger 驱动生长
├── TimelineDividers.vue        ← 阶段分隔线（"2019-2022" / "2022-2026"）
└── TimelineNode.vue × N        ← 单个时间节点（圆点 + 日期 + 卡片）
```

### 布局方案

```
        ┃
        ┃  ● 2020.03  ┌──────────────────────┐
        ┃  │           │ 公司：XXX            │
        ┃  │           │ 职位：前端开发        │
        ┃  │           │ 项目：XXX            │
        ┃  │           │ 描述...              │
        ┃  │           │ [Vue] [TS] [Vite]   │
        ┃  │           └──────────────────────┘
        ┃  │
        ┃  ● 2021.08  ┌──────────────────────┐
        ┃  │           │  ...                 │
        ┃  │           └──────────────────────┘
```

- 竖线居中偏左（`left: 15%`），卡片统一右侧
- 日期标签在圆点左侧或紧贴右侧
- 响应式：移动端竖线贴左边，卡片占满剩余宽度

## 3. 数据结构

```ts
// src/views/types/timeline.ts

interface Project {
  name: string           // 项目名称
  description: string    // 简短描述
  highlights: string[]   // 成果/亮点列表
  techStack: string[]    // 技术栈标签
  period: string         // 在职时间段，如 "2019.06 - 2020.03"
}

interface Experience {
  id: string
  date: string           // "2019.06"
  company: string        // 公司名称
  position: string       // 职位
  projects: Project[]
}
```

页面数据以 `Experience[]` 数组硬编码在 `TimelineView.vue` 中（后续可迁移到后端 API）。

## 4. 动画方案

所有动画使用 GSAP ScrollTrigger，在 `onMounted` 中初始化。

| 元素 | 动画 | 触发方式 |
|------|------|----------|
| 竖线 | `scaleY(0 → 1)`，从顶部向下生长 | ScrollTrigger 绑定 `scroll`，进度映射到线的 `scaleY` |
| 节点圆点 | `scale(0 → 1)` + `elastic` 缓出 | ScrollTrigger `trigger: 节点元素`，进入视口触发 |
| 日期标签 | `opacity(0 → 1)` + `translateX(-20 → 0)` | 同上 |
| 卡片 | `opacity(0 → 1)` + `translateY(40 → 0)` | 同上，带 `stagger` 延迟 |
| 阶段分隔线 | `opacity(0 → 1)` + 发光脉冲 | 进入视口触发 |
| 卡片 hover | `translateY(-4px)` + `box-shadow` 增强 | 纯 CSS `transition` |

竖线生长逻辑：线的根节点 `transform-origin: top`，用 `ScrollTrigger.create()` 将页面滚动进度（从第一个节点到最后一个节点）映射为竖线 `scaleY` 从 0 到 1。

## 5. 样式规范

遵循项目已有暗色主题 Token（`base.css`）：

| 元素 | 样式 |
|------|------|
| 竖线 | 宽度 2px，背景渐变 `linear-gradient(to bottom, var(--color-accent), var(--color-accent-cyan))` |
| 节点圆点 | 直径 14px，白色填充 + `var(--color-accent-cyan)` 边框 3px + 外发光 `box-shadow` |
| 日期标签 | `var(--color-accent-cyan)`，字体 `var(--font-size-sm)`，`font-weight: 600` |
| 卡片 | `background: rgba(255,255,255,0.04)` + `border: 1px solid var(--color-border-dark)` + `border-radius: var(--radius-lg)` + `padding: var(--space-6)` |
| 阶段分隔线 | 水平虚线 + 年份标签 + 发光效果 |
| 技术栈标签 | 复用 `BlogHome.vue` 中的 `.skill-tag` 样式 |

## 6. 响应式

- **桌面端（≥768px）**：竖线 `left: 15%`，卡片 `margin-left: 20%`
- **移动端（<768px）**：竖线 `left: 8px`，卡片 `margin-left: 32px`，卡片宽度自适应

## 7. 数据占位

实现时使用示例数据填充，两个阶段各 2-3 条经历，标注为占位数据（用户后续可自行修改）。

## 8. 边界情况

- 无数据时显示"暂无经历记录"
- 最后一个节点竖线不延伸到页面底部（止于最后一个圆点）
- 竖线生长完成后保持可见
- `prefers-reduced-motion` 时禁用所有动画（已在 `base.css` 中全局处理）

## 9. 约束

- 不引入新依赖（GSAP 已有）
- 不修改路由配置（已存在）
- 不修改导航栏（已存在）
- 不修改全局样式变量
- 所有注释和提交信息使用中文
