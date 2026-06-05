# KOKO的博客 — Vue 3 + TypeScript 全栈项目

> Vue 3 + Vite + TypeScript 构建的个人博客 + 后台管理系统，包含虚拟滚动表格、小游戏、中英文国际化、暗色主题等功能。

---

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Vue 3.5 + Composition API |
| 语言 | TypeScript 5.9 |
| 构建 | Vite 7 |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 5（History 模式） |
| HTTP | Axios |
| 虚拟滚动 | @tanstack/vue-virtual |
| 动画 | GSAP |
| 代码规范 | ESLint + Oxlint + Prettier + Commitlint + Husky |

---

## 项目启动

```sh
npm install
npm run dev      # 开发模式，访问 http://localhost:5173
npm run build    # 生产构建
npm run preview  # 预览生产构建
npm run lint     # 代码检查
```

---

## 项目文件架构

```
creatNewVue/
│
├── index.html                  # Vite 入口 HTML
├── vite.config.ts              # Vite 构建配置（含 @ 路径别名、生产 base 路径）
├── tsconfig.json               # TypeScript 配置入口
├── tsconfig.app.json           # 应用 TS 配置
├── tsconfig.node.json          # Node 端 TS 配置（Vite 配置文件）
├── eslint.config.ts            # ESLint 扁平化配置
├── .oxlintrc.json              # Oxlint 规则配置
├── .prettierrc.json            # Prettier 格式化配置
├── .commitlintrc.json          # Commitlint 提交信息规范
├── .cz-config.cjs              # Commitizen 交互式提交配置
├── .editorconfig               # 编辑器统一设置
├── .env                        # 环境变量（API 地址、Mock 开关）
├── env.d.ts                    # 全局类型声明（Vite 环境变量）
├── package.json                # 项目依赖与脚本
│
├── public/                     # 静态资源（直接拷贝到 dist）
│   ├── favicon.ico
│   └── 404.html
│
├── docs/                       # 项目文档
│   └── superpowers/
│       ├── specs/              # 设计规格文档
│       │   ├── 2026-05-29-blog-redesign-design.md
│       │   ├── 2026-06-03-timeline-page-design.md
│       │   └── 2026-06-05-admin-manage-design.md
│       └── plans/              # 实现计划文档
│           ├── 2026-05-29-blog-redesign-plan.md
│           └── 2026-06-05-admin-manage.md
│
└── src/                        # 源代码根目录
    │
    ├── main.ts                 # 应用入口：创建 Vue 实例 → 注册 Pinia + Router → 挂载
    ├── App.vue                 # 根组件：全局布局（导航栏 + 路由视图 + 页脚 + 星空背景 + 音乐播放器）
    │
    ├── api/                    # 接口层
    │   ├── request.ts          # Axios 实例封装（拦截器、token 注入、统一错误处理、GET/POST/PUT/DELETE 快捷方法）
    │   ├── backend.ts          # 后端 /api/hello 问候接口
    │   └── admin.ts            # 后台管理 API：含 10 万条 mock 数据生成器、分页查询、多条件过滤；通过 VITE_USE_MOCK 切换 mock/真实模式
    │
    ├── assets/                 # 静态资源
    │   ├── base.css            # 设计令牌（CSS 变量）：颜色、间距、字体、圆角、过渡、z-index、暗色/亮色主题
    │   ├── main.css            # 全局样式：容器工具类、滚动条美化、H5 触控适配
    │   ├── logo.svg            # 站点 Logo
    │   ├── cat.jpg             # 头像图片
    │   └── music/              # 音乐资源
    │       ├── gaobaiqiqiu.mp3 # 背景音乐
    │       └── gaobaiqiqiu.lrc # 歌词文件
    │
    ├── components/             # 组件
    │   ├── common/             # 全局通用组件
    │   │   ├── AppNavbar.vue   # 全局导航栏：桌面端下拉菜单 + 移动端汉堡按钮 + 暗色/亮色主题切换
    │   │   └── AppFooter.vue   # 全局页脚
    │   │
    │   ├── blog/               # 博客专用组件
    │   │   ├── StarryBackground.vue  # 星空粒子背景（Canvas 动画，仅暗色模式）
    │   │   ├── MouseTrail.vue        # 鼠标拖尾特效（仅暗色模式）
    │   │   ├── TypeWriter.vue        # 打字机效果文字
    │   │   ├── ScrollReveal.vue      # 滚动渐显动画
    │   │   ├── SectionCard.vue       # 通用卡片组件
    │   │   ├── MusicPlayer.vue       # 全屏音乐播放器（含歌词同步滚动）
    │   │   └── MusicMini.vue         # 迷你音乐播放器（右上角悬浮）
    │   │
    │   ├── admin/              # 后台管理组件
    │   │   ├── SearchForm.vue       # 搜索表单容器：插槽式布局 + 搜索/重置按钮（含 loading spinner），480px H5 适配
    │   │   ├── VirtualDropdown.vue  # 虚拟下拉选择器：基于 @tanstack/vue-virtual，支持万级选项搜索过滤、键盘导航、点击外部关闭
    │   │   ├── VirtualTable.vue     # 虚拟表格：固定表头 + 行虚拟滚动，百万数据无卡顿，骨架屏 loading，空状态提示，768px H5 适配
    │   │   └── Pagination.vue       # 分页器：总条数 + 页码按钮（首尾常驻 ±2 省略号）+ 每页条数选择（20/50/100/500），768px H5 适配
    │   │
    │   ├── Modal/              # 通用弹窗组件
    │   │   ├── Modal.vue       # 弹窗组件本体（支持 v-model、插槽、自定义配置）
    │   │   ├── modal.ts        # 弹窗核心逻辑
    │   │   ├── plugin.ts       # 弹窗插件安装（app.use 注册全局方法）
    │   │   ├── index.ts        # 导出入口
    │   │   ├── types/index.ts  # 弹窗类型定义（Props、Events、Slots）
    │   │   └── README.md       # 弹窗组件使用文档
    │   │
    │   └── icons/              # SVG 图标组件
    │       ├── IconCommunity.vue
    │       ├── IconDocumentation.vue
    │       ├── IconEcosystem.vue
    │       ├── IconSupport.vue
    │       └── IconTooling.vue
    │
    ├── composables/            # 组合式函数（Composables）
    │   ├── useI18n.ts          # 中英文国际化：提供全局翻译表（zh/en 两组 key-value），支持 t() 翻译、toggleLocale() 切换语言、setLocale() 指定语言
    │   ├── useSearch.ts        # 后台搜索逻辑：泛型 formData（v-model 绑定）、search() 快照过滤空值、reset() 恢复初始值
    │   ├── useTable.ts         # 后台表格数据管理：loading 状态、分页（page/pageSize）、错误捕获、refresh() 刷新、fetcher 注入
    │   └── useVirtualScroll.ts # 虚拟滚动封装：基于 @tanstack/vue-virtual 的 useVirtualizer，返回 virtualItems + totalHeight
    │
    ├── data/                   # 策略模式数据层（数据与组件分离）
    │   ├── navigation.ts       # 导航配置：mainNav（主导航）、practiceNav（练手页面）、gamesNav（小游戏）、adminNav 重导出
    │   ├── admin-navigation.ts # 后台管理导航项（📊 后台管理 → /admin/manage）
    │   ├── homepage.ts         # 首页数据：Stats 数据看板、文章列表、技术栈标签、项目案例等
    │   ├── features.ts         # 经历页功能特性数据（ExperienceView 数据源）
    │   ├── games.ts            # 小游戏配置数据（游戏列表、描述、路由）
    │   └── timeline.ts         # 时间线经历数据（按阶段组织：2019-2022、2022-2024 等）
    │
    ├── router/                 # 路由
    │   └── index.ts            # 路由表（全部懒加载）：博客首页、时间线、文章、经历、友链、小游戏（打地鼠/猜数字）、练手页面、后台管理
    │
    ├── stores/                 # Pinia 状态管理
    │   ├── theme.ts            # 主题状态：暗色/亮色切换，localStorage 持久化，data-theme 属性绑定
    │   ├── music.ts            # 音乐播放状态：播放/暂停、歌词解析、当前时间、播放列表
    │   └── counter.ts          # 计数器示例（练手用）
    │
    └── views/                  # 页面视图
        ├── BlogHome.vue        # 博客首页：数据看板、文章列表、技术栈
        ├── TimelineView.vue    # 时间线页面：按年份/阶段展示个人经历
        ├── ExperienceView.vue  # 经历详情页：分阶段展示项目经验 + 技术栈
        ├── FriendsView.vue     # 友链页面：友情链接展示
        ├── HomeView.vue        # 练手·首页：组件通信演示
        ├── AboutView.vue       # 练手·关于：弹窗组件标签用法演示
        ├── ModalDemo.vue       # 练手·弹窗：弹窗插件 API 用法演示
        │
        ├── admin/              # 后台管理
        │   └── AdminManage.vue # 后台管理壳子页面：搜索区 + 虚拟表格 + 分页，内置用户管理 demo（10 万条 mock 数据驱动）
        │
        ├── articles/           # 文章
        │   ├── ArticlesView.vue      # 文章列表页
        │   ├── InterviewArticle.vue  # 面经文章详情页
        │   ├── articles-data.ts      # 文章数据
        │   └── interview-content.ts  # 面经文章内容
        │
        ├── games/              # 小游戏
        │   ├── GamesHub.vue    # 游戏大厅
        │   ├── GuessNumber.vue # 猜数字游戏
        │   └── WhackMole.vue   # 打地鼠游戏
        │
        ├── components/         # 视图级子组件
        │   └── HomeChild.vue   # 练手页面子组件（父子通信演示）
        │
        └── types/              # 视图类型定义
            ├── timeline.ts     # 时间线类型（Experience、Skill 等）
            └── homeChild.ts    # 练手子组件 Props 类型
```

---

## 核心架构说明

### 数据流架构

```
data/*.ts (策略模式数据层)
    ↓ 导入
views/*.vue (页面组件)
    ↓ 使用
components/**/*.vue (UI 组件)
    ↑ 状态注入
stores/*.ts (Pinia 全局状态)
    ↑ API 调用
api/*.ts (接口层 → Axios → 后端)
```

- **硬编码数据清零：** 所有组件内静态数据已全部迁移至 `src/data/` 目录，采用策略模式管理。组件仅负责渲染，数据由外部注入。
- **Mock/真实切换：** 后台管理页面通过 `.env` 中的 `VITE_USE_MOCK` 变量控制；设为 `true` 使用本地 10 万条 mock 数据，设为 `false` 调用真实后端 API。

### 主题系统

- CSS 变量定义在 `src/assets/base.css`，分为 `:root`（通用令牌）和暗色/亮色两组变量。
- 暗色模式为默认主题，亮色模式通过 `[data-theme='light']` 切换。
- 博客页面跟随全局主题，后台管理页面使用独立蓝白配色（`--admin-*` 命名空间）。

### 国际化

- `useI18n` composable 提供中英文翻译能力，所有 UI 文本以 key-value 形式存储在 `messages` 对象中。
- 全局 `currentLocale` ref 可被任意组件引用，切换语言后所有使用 `t()` 的地方自动更新。

### 虚拟滚动

- `@tanstack/vue-virtual` 驱动的虚拟化方案，仅渲染可视区域内的 DOM 节点。
- `VirtualDropdown` 适用于万级选项的下拉列表，`VirtualTable` 适用于百万级数据的表格。

### 响应式设计

- 全局断点：768px（平板）、480px（手机）。
- 导航栏：768px 以下切换为汉堡菜单，480px 以下缩小高度。
- 后台管理：768px 表格横向滚动，480px 搜索字段纵向堆叠。
- 触控优化：最小触控区域 44px，安全区域适配（iPhone 刘海屏）。

---

## Git 提交规范

使用 Conventional Commits 规范，通过 Husky + Commitlint 强制校验：

```sh
npm run commit   # 交互式提交（Commitizen）
```

提交类型：`feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `ci` `build`

所有注释和 commit message 使用中文。

---

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 基础地址 | `http://localhost:8080` |
| `VITE_USE_MOCK` | 后台管理是否使用 mock 数据 | `true` |
