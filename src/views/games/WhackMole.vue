<template>
  <div class="mole-game">
    <div class="game-wrapper">
      <RouterLink to="/games" class="back-link">← 返回游戏大厅</RouterLink>

      <div class="game-panel">
        <!-- 顶栏：得分 + 计时 + 暂停按钮 -->
        <div class="top-bar">
          <div class="score-board">
            <span class="score-label">得分</span>
            <span class="score-num">{{ score }}</span>
          </div>
          <div class="timer-board" :class="{ 'timer-warn': timeLeft <= 5 && gameState === 'playing' }">
            <span class="timer-label">时间</span>
            <span class="timer-num">{{ timeLeft }}s</span>
          </div>
          <button
            v-if="gameState === 'playing' || gameState === 'paused'"
            class="pause-btn"
            @click="togglePause"
            :title="gameState === 'paused' ? '继续' : '暂停'"
          >
            {{ gameState === 'paused' ? '▶' : '⏸' }}
          </button>
        </div>

        <!-- 9 宫格打地鼠区（仅游戏中或暂停中显示） -->
        <div class="mole-grid" v-if="gameState === 'playing' || gameState === 'paused'">
          <div
            v-for="i in 9"
            :key="i"
            class="mole-hole"
            :class="{ active: activeHole === i && gameState === 'playing', whacked: whackedHole === i }"
            @click="whack(i)"
            @touchend.prevent="whack(i)"
          >
            <div class="hole-bg"></div>
            <div class="mole">
              <span class="mole-face">🐹</span>
            </div>
          </div>
          <!-- 暂停遮罩 -->
          <div v-if="gameState === 'paused'" class="pause-overlay">
            <span class="pause-emoji">⏸</span>
            <span class="pause-text">已暂停</span>
          </div>
        </div>

        <!-- 空闲状态 -->
        <div v-if="gameState === 'idle'" class="game-idle">
          <span class="idle-emoji">🔨</span>
          <h2 class="idle-title">打地鼠</h2>
          <p class="idle-desc">地鼠随机冒出，眼疾手快锤爆它们！</p>
          <button class="start-btn" @click="startGame">开始游戏</button>
        </div>

        <!-- 游戏结束 -->
        <div v-if="gameState === 'over'" class="game-result">
          <span class="result-emoji">🎉</span>
          <h2 class="result-title">时间到！</h2>
          <div class="result-score-card">
            <span class="result-score-label">最终得分</span>
            <span class="result-score-num">{{ score }}</span>
            <span class="result-score-unit">只地鼠</span>
          </div>
          <div class="result-actions">
            <button class="restart-btn" @click="startGame">再来一局</button>
            <RouterLink to="/games" class="back-hub-btn">返回大厅</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

const GAME_DURATION = 20
const MOLE_INTERVAL_MIN = 600
const MOLE_INTERVAL_MAX = 1200

type GameState = 'idle' | 'playing' | 'paused' | 'over'

const gameState = ref<GameState>('idle')
const score = ref(0)
const timeLeft = ref(GAME_DURATION)
const activeHole = ref(0)
const whackedHole = ref(0)

let moleTimer: ReturnType<typeof setTimeout> | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null
let whackResetTimer: ReturnType<typeof setTimeout> | null = null

function randomHole(): number {
  return Math.floor(Math.random() * 9) + 1
}

function showMole() {
  if (gameState.value !== 'playing') return
  activeHole.value = randomHole()
  const duration = Math.random() * 600 + 400
  setTimeout(() => {
    if (activeHole.value > 0 && whackedHole.value !== activeHole.value) {
      activeHole.value = 0
    }
  }, duration)
}

function scheduleNext() {
  if (gameState.value !== 'playing') return
  const delay = Math.random() * (MOLE_INTERVAL_MAX - MOLE_INTERVAL_MIN) + MOLE_INTERVAL_MIN
  moleTimer = setTimeout(() => {
    showMole()
    scheduleNext()
  }, delay)
}

function whack(hole: number) {
  if (gameState.value !== 'playing') return
  if (activeHole.value !== hole) return
  score.value++
  whackedHole.value = hole
  activeHole.value = 0
  if (whackResetTimer) clearTimeout(whackResetTimer)
  whackResetTimer = setTimeout(() => { whackedHole.value = 0 }, 300)
}

function clearAllTimers() {
  if (moleTimer) { clearTimeout(moleTimer); moleTimer = null }
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null }
  if (whackResetTimer) { clearTimeout(whackResetTimer); whackResetTimer = null }
}

function startGame() {
  clearAllTimers()
  score.value = 0
  timeLeft.value = GAME_DURATION
  activeHole.value = 0
  whackedHole.value = 0
  gameState.value = 'playing'

  countdownTimer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      endGame()
    }
  }, 1000)

  scheduleNext()
}

function togglePause() {
  if (gameState.value === 'playing') {
    gameState.value = 'paused'
    clearAllTimers()
  } else if (gameState.value === 'paused') {
    gameState.value = 'playing'
    // 恢复倒计时
    countdownTimer = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) endGame()
    }, 1000)
    // 恢复出地鼠
    scheduleNext()
  }
}

function endGame() {
  gameState.value = 'over'
  activeHole.value = 0
  clearAllTimers()
}

onUnmounted(() => { clearAllTimers() })
</script>

<style scoped>
.mole-game {
  min-height: 100vh;
  background: var(--color-bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.game-wrapper {
  width: 100%;
  max-width: 420px;
}

.back-link {
  display: inline-block;
  margin-bottom: var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
  transition: color 0.2s ease;
}

.back-link:hover { color: var(--color-accent-cyan); }

.game-panel {
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  position: relative;
}

/* ===== 顶栏 ===== */
.top-bar {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: var(--space-8);
  margin-bottom: var(--space-6);
}

.score-board, .timer-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.score-label, .timer-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.score-num, .timer-num {
  font-size: var(--font-size-3xl);
  font-weight: 800;
}

.score-num { color: var(--color-accent-cyan); }
.timer-num { color: var(--color-heading); }

.timer-warn .timer-num {
  color: #ef4444;
  animation: pulse-warn 0.5s ease-in-out infinite;
}

@keyframes pulse-warn {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* 暂停按钮 */
.pause-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: var(--color-bg-dark-tertiary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-full);
  color: var(--color-text-inverse-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  align-self: center;
}

.pause-btn:hover {
  border-color: var(--color-accent-cyan);
  color: var(--color-accent-cyan);
}

/* ===== 九宫格 ===== */
.mole-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
  padding: var(--space-2);
  position: relative;
  user-select: none;
  -webkit-user-select: none;
}

.mole-hole {
  position: relative;
  aspect-ratio: 1;
  background: var(--color-bg-dark-tertiary);
  border-radius: var(--radius-xl);
  cursor: pointer;
  overflow: hidden;
  transition: box-shadow 0.15s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.mole-hole:active {
  box-shadow: inset 0 4px 12px rgba(0, 0, 0, 0.4);
}

.hole-bg {
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 30%;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

.mole {
  position: absolute;
  bottom: -60%;
  left: 50%;
  transform: translateX(-50%);
  transition: bottom 0.12s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mole-face {
  font-size: 48px;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.mole-hole.active .mole { bottom: 8%; }

.mole-hole.whacked .mole-face {
  animation: whack-effect 0.3s ease;
}

@keyframes whack-effect {
  0% { transform: scale(1); }
  30% { transform: scale(0.7) rotate(-15deg); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
}

.mole-hole.whacked {
  box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.3);
}

/* 暂停遮罩 */
.pause-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  background: rgba(0, 0, 0, 0.55);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(4px);
  z-index: 10;
}

.pause-emoji { font-size: 48px; }

.pause-text {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: #fff;
}

/* ===== 空闲状态 ===== */
.game-idle {
  text-align: center;
  padding: var(--space-10) var(--space-4);
}

.idle-emoji {
  font-size: 64px;
  display: block;
  margin-bottom: var(--space-4);
}

.idle-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: var(--space-3);
}

.idle-desc {
  font-size: var(--font-size-base);
  color: var(--color-text-inverse-secondary);
  margin-bottom: var(--space-6);
  line-height: 1.7;
}

.start-btn {
  padding: var(--space-4) var(--space-10);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.start-btn:hover { transform: scale(1.05); box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4); }
.start-btn:active { transform: scale(0.97); }

/* ===== 游戏结束 ===== */
.game-result {
  text-align: center;
  padding: var(--space-8) var(--space-4);
}

.result-emoji {
  font-size: 56px;
  display: block;
  margin-bottom: var(--space-4);
}

.result-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: var(--space-5);
}

.result-score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-5);
  margin-bottom: var(--space-6);
  background: var(--color-bg-dark-tertiary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-lg);
}

.result-score-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-inverse-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.result-score-num {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  color: var(--color-accent-cyan);
}

.result-score-unit {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-secondary);
}

.result-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.restart-btn {
  padding: var(--space-3) var(--space-10);
  font-size: var(--font-size-base);
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
}

.restart-btn:hover { transform: scale(1.05); box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4); }
.restart-btn:active { transform: scale(0.97); }

.back-hub-btn {
  padding: var(--space-2) var(--space-6);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-inverse-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-full);
  transition: all 0.2s ease;
}

.back-hub-btn:hover {
  color: var(--color-accent-cyan);
  border-color: rgba(6, 182, 212, 0.4);
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .game-panel { padding: var(--space-4); }
  .mole-face { font-size: 38px; }
  .score-num, .timer-num { font-size: var(--font-size-2xl); }
  .top-bar { gap: var(--space-6); }
  .result-score-num { font-size: var(--font-size-3xl); }
}
</style>
