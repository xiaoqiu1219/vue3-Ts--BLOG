# 私人博客改造设计文档

**日期**: 2026-05-29 | **状态**: 已确认

## 1. 目标

将现有 Vue3 练手项目改造为私人博客，原练手页面保留在独立导航入口。

## 2. 技术栈

- Vue 3 + TypeScript + Vite 7
- Pinia（状态管理） + Vue Router（路由）
- GSAP（滚动动画）
- 纯 Canvas（鼠标粒子拖尾）
- 纯 CSS（星空背景动画 + 音乐跳动动画）

不引入 tsParticles、particles.js 等额外粒子库，保持依赖精简。星空用 CSS `box-shadow`/渐变实现，鼠标拖尾用 Canvas。

## 3. 路由设计

```
/                → BlogHome.vue       (博客首页)
/timeline        → TimelineView.vue   (时间线，占位)
/articles        → ArticlesView.vue   (文章，占位)
/experience      → ExperienceView.vue (经历，占位)
/friends         → FriendsView.vue    (友链，占位)
/practice/home   → HomeView.vue       (练手：原首页)
/practice/about  → AboutView.vue      (练手：原关于)
/practice/modal  → ModalDemo.vue      (练手：原弹窗演示)
```

路由采用懒加载，博客页面作为一个路由组，练手页面作为 `/practice/*` 子路由组。

## 4. 首页结构

从上到下逐板块：

| 顺序 | 板块 | 内容 | 动画 |
|------|------|------|------|
| 1 | Hero | 星空背景 + 博客名 + 一句描述 + CTA 按钮 | 鼠标粒子拖尾（Canvas） |
| 2 | 音乐播放器 | 音乐播放 + CSS 跳动频谱动画 | GSAP 滚动触发进入 |
| 3 | 打字机诗词 | 诗句逐字打出 | GSAP 滚动触发进入 |
| 4 | 最新文章 | 文章卡片列表（占位数据） | GSAP 滚动触发进入 |
| 5 | 个人简介 | 头像/摘要/技能标签 | GSAP 滚动触发进入 |

## 5. 组件拆分

### 全局公共组件

| 组件 | 文件 | 说明 |
|------|------|------|
| AppNavbar | `src/components/common/AppNavbar.vue` | 顶部导航栏，含博客导航 + "更多"下拉（练手页面入口） |
| AppFooter | `src/components/common/AppFooter.vue` | 底部页脚 |

### 首页专用组件

| 组件 | 文件 | 说明 |
|------|------|------|
| StarryBackground | `src/components/blog/StarryBackground.vue` | 纯 CSS 星空背景（多层 box-shadow 动画） |
| MouseTrail | `src/components/blog/MouseTrail.vue` | Canvas 鼠标粒子拖尾 |
| ScrollReveal | `src/components/blog/ScrollReveal.vue` | GSAP scrollTrigger 封装的渐入容器 |
| MusicPlayer | `src/components/blog/MusicPlayer.vue` | 音乐播放 + CSS 跳动频谱动画 |
| TypeWriter | `src/components/blog/TypeWriter.vue` | 打字机逐字输出效果 |
| SectionCard | `src/components/blog/SectionCard.vue` | 通用卡片容器 |

### 已有组件

| 组件 | 路径 | 处理方式 |
|------|------|----------|
| Modal | `src/components/Modal/` | 保留不动，练手页面继续使用 |
| Icon* | `src/components/icons/` | 保留不动 |
| useI18n | `src/composables/useI18n.ts` | 仅练手页面使用 |

### 组件目录结构

```
src/components/
  common/           ← 全局公共组件
    AppNavbar.vue
    AppFooter.vue
  blog/             ← 博客首页专用组件
    StarryBackground.vue
    MouseTrail.vue
    ScrollReveal.vue
    MusicPlayer.vue
    TypeWriter.vue
    SectionCard.vue
  Modal/            ← 已有，不动
  icons/            ← 已有，不动
```

## 6. 全局样式策略

- **配色**: 深色科技风 — 主背景 `#0a0a1a`（深邃星空蓝黑），文字白/灰，点缀色蓝 `#3b82f6` / 青 `#06b6d4`
- 首页各板块全屏宽度深色背景，保持星空主题一致
- **导航栏**: 半透明深色 + `backdrop-filter: blur()`，与星空氛围融合
- 练手页面内部保持原有浅色样式，独立不感知博客风格
- CSS 变量体系在 `base.css` 中扩展深色主题需要的 Token（如 `--color-bg-dark`、`--color-text-inverse-secondary` 等）

## 7. 不引入的内容

- 不引入第三方粒子库（tsParticles 等），鼠标拖尾用纯 Canvas 实现
- 不引入 GSAP 以外的动画库
- 不修改 Modal 组件和练手页面的现有功能
- 暂不实现暗色/浅色模式切换（全程深色）
