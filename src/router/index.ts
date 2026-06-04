import { createRouter, createWebHistory } from 'vue-router'

// 创建路由实例，使用 History 模式，路由均采用懒加载
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 每次路由切换滚动到顶部
  scrollBehavior() {
    return { top: 0 }
  },
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
      component: () => import('../views/articles/ArticlesView.vue'),
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
    // ===== 小游戏 =====
    {
      path: '/games',
      name: 'games-hub',
      component: () => import('../views/games/GamesHub.vue'),
    },
    {
      path: '/games/guess-number',
      name: 'game-guess-number',
      component: () => import('../views/games/GuessNumber.vue'),
    },
    {
      path: '/articles/interview-advanced',
      name: 'article-interview-advanced',
      component: () => import('../views/articles/InterviewArticle.vue'),
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
