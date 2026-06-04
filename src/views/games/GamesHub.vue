<template>
  <div class="games-hub">
    <!-- Hero -->
    <section class="games-hero">
      <div class="hero-inner">
        <h1 class="hero-title">🎮 小游戏</h1>
        <p class="hero-desc">摸鱼一时爽，一直摸鱼一直爽</p>
      </div>
    </section>

    <!-- 游戏卡片网格 -->
    <section class="games-grid container">
      <RouterLink
        v-for="game in games"
        :key="game.id"
        :to="game.online ? game.path : '#'"
        class="game-card"
        :class="{ 'game-offline': !game.online }"
        :style="{ '--accent': game.color }"
        @click.prevent="!game.online && $event.preventDefault()"
      >
        <span class="game-icon">{{ game.icon }}</span>
        <div class="game-info">
          <div class="game-head">
            <h3 class="game-name">{{ game.name }}</h3>
            <span class="game-difficulty" :class="'diff-' + game.difficulty">{{ game.difficulty }}</span>
          </div>
          <p class="game-desc">{{ game.desc }}</p>
        </div>
        <span v-if="!game.online" class="game-badge">即将上线</span>
      </RouterLink>

      <p v-if="games.length === 0" class="empty-hint">游戏正在开发中，敬请期待~</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { games } from '@/data/games'
</script>

<style scoped>
.games-hub {
  min-height: 100vh;
  background: var(--color-bg-dark);
  color: var(--color-heading);
  padding-bottom: var(--space-16);
}

/* ===== Hero ===== */
.games-hero {
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
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 30%, #ec4899 60%, #8b5cf6 100%);
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

/* ===== 游戏卡片网格 ===== */
.container {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.game-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-xl);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 3px;
  background: var(--accent, var(--color-accent));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.game-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent, rgba(6, 182, 212, 0.4));
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.game-card:hover::before {
  opacity: 1;
}

.game-card.game-offline {
  opacity: 0.5;
  cursor: not-allowed;
}

.game-card.game-offline:hover {
  transform: none;
  border-color: var(--color-border-dark);
  box-shadow: none;
}

.game-card.game-offline:hover::before {
  opacity: 0;
}

.game-icon {
  font-size: 40px;
  line-height: 1;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.game-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.game-name {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-heading);
}

.game-difficulty {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.diff-简单 {
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
}

.diff-中等 {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.12);
}

.diff-困难 {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.12);
}

.game-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
  line-height: 1.6;
}

.game-badge {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  padding: 2px 10px;
  font-size: 11px;
  color: var(--color-text-inverse-tertiary);
  background: var(--color-bg-dark-tertiary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-full);
}

.empty-hint {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--space-12) 0;
  color: var(--color-text-inverse-tertiary);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .games-hero { padding: var(--space-12) var(--space-4) var(--space-8); }
  .hero-title { font-size: var(--font-size-3xl); }
  .hero-desc { font-size: var(--font-size-base); }
  .games-grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-4); }
  .game-card { padding: var(--space-4); }
  .game-icon { font-size: 32px; }
  .game-name { font-size: var(--font-size-base); }
}

@media (max-width: 480px) {
  .games-hero { padding: var(--space-8) var(--space-3) var(--space-6); }
  .hero-title { font-size: var(--font-size-2xl); }
  .hero-desc { font-size: var(--font-size-sm); }
  .games-grid { grid-template-columns: 1fr; gap: var(--space-3); }
  .game-card { padding: var(--space-4); }
}
</style>
