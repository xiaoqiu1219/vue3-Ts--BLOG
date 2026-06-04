<template>
  <div class="guess-game">
    <div class="game-container">
      <RouterLink to="/games" class="back-link">← 返回游戏大厅</RouterLink>

      <div class="game-card-main">
        <h1 class="game-title">🔢 猜数字</h1>
        <p class="game-rules">我心里想了一个 1~100 之间的数字，你有 <strong>{{ maxAttempts }}</strong> 次机会猜中它。</p>

        <!-- 游戏进行中 -->
        <template v-if="gameState === 'playing'">
          <div class="guess-area">
            <input
              ref="inputRef"
              v-model.number="guess"
              type="number"
              min="1"
              max="100"
              placeholder="输入 1~100"
              class="guess-input"
              @keyup.enter="submitGuess"
            />
            <button class="guess-btn" @click="submitGuess" :disabled="!guess">猜！</button>
          </div>

          <div v-if="hint" class="hint-text" :class="hintColor">{{ hint }}</div>

          <div class="attempts-info">
            已猜 <strong>{{ attempts }}</strong> / {{ maxAttempts }} 次
          </div>
          <div class="history">
            <span v-for="(h, i) in historyList" :key="i" class="history-tag" :class="h.type">
              {{ h.value }}
              <span v-if="h.type === 'low'">↑</span>
              <span v-else-if="h.type === 'high'">↓</span>
            </span>
          </div>
        </template>

        <!-- 胜利 -->
        <template v-else-if="gameState === 'won'">
          <div class="result-card won">
            <span class="result-emoji">🎉</span>
            <h2 class="result-title">恭喜你猜中了！</h2>
            <p class="result-detail">答案就是 <strong>{{ target }}</strong>，你用了 <strong>{{ attempts }}</strong> 次猜中。</p>
            <button class="restart-btn" @click="startGame">再来一局</button>
          </div>
        </template>

        <!-- 失败 -->
        <template v-else-if="gameState === 'lost'">
          <div class="result-card lost">
            <span class="result-emoji">😢</span>
            <h2 class="result-title">次数用完了</h2>
            <p class="result-detail">正确答案是 <strong>{{ target }}</strong>，下次加油！</p>
            <button class="restart-btn" @click="startGame">再来一局</button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { RouterLink } from 'vue-router'

const maxAttempts = 7
const gameState = ref<'playing' | 'won' | 'lost'>('playing')
const target = ref(0)
const guess = ref<number | null>(null)
const attempts = ref(0)
const hint = ref('')
const hintColor = ref('')
const historyList = ref<{ value: number; type: string }[]>([])
const inputRef = ref<HTMLInputElement | null>(null)

function startGame() {
  target.value = Math.floor(Math.random() * 100) + 1
  gameState.value = 'playing'
  guess.value = null
  attempts.value = 0
  hint.value = ''
  historyList.value = []
  nextTick(() => inputRef.value?.focus())
}

function submitGuess() {
  if (!guess.value || guess.value < 1 || guess.value > 100) return
  if (gameState.value !== 'playing') return

  attempts.value++
  const val = guess.value

  if (val === target.value) {
    gameState.value = 'won'
    hint.value = ''
    historyList.value.push({ value: val, type: 'match' })
  } else if (attempts.value >= maxAttempts) {
    gameState.value = 'lost'
    hint.value = ''
  } else if (val < target.value) {
    hint.value = `太小了，往大猜！`
    hintColor.value = 'hint-low'
    historyList.value.push({ value: val, type: 'low' })
  } else {
    hint.value = `太大了，往小猜！`
    hintColor.value = 'hint-high'
    historyList.value.push({ value: val, type: 'high' })
  }

  guess.value = null
  nextTick(() => inputRef.value?.focus())
}

startGame()
</script>

<style scoped>
.guess-game {
  min-height: 100vh;
  background: var(--color-bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
}

.game-container {
  width: 100%;
  max-width: 480px;
}

.back-link {
  display: inline-block;
  margin-bottom: var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-accent-cyan);
}

.game-card-main {
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  text-align: center;
}

.game-title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-heading);
  margin-bottom: var(--space-3);
}

.game-rules {
  font-size: var(--font-size-base);
  color: var(--color-text-inverse-secondary);
  line-height: 1.7;
  margin-bottom: var(--space-6);
}

/* 猜数字输入区 */
.guess-area {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-bottom: var(--space-4);
}

.guess-input {
  width: 140px;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-xl);
  font-weight: 700;
  text-align: center;
  color: var(--color-heading);
  background: var(--color-bg-dark-tertiary);
  border: 2px solid var(--color-border-dark);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color 0.2s ease;
  -moz-appearance: textfield;
}

.guess-input::-webkit-outer-spin-button,
.guess-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

.guess-input:focus {
  border-color: var(--color-accent-cyan);
}

.guess-btn {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #fff;
  background: var(--color-accent-cyan);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.guess-btn:hover:not(:disabled) {
  background: #0891b2;
  transform: scale(1.03);
}

.guess-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 提示 */
.hint-text {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-3);
  min-height: 28px;
}

.hint-low { color: #f59e0b; }
.hint-high { color: #3b82f6; }

.attempts-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
  margin-bottom: var(--space-4);
}

/* 历史记录 */
.history {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2);
}

.history-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px 10px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  border-radius: var(--radius-full);
}

.history-tag.low {
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.12);
}

.history-tag.high {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
}

.history-tag.match {
  color: #10b981;
  background: rgba(16, 185, 129, 0.15);
  font-size: var(--font-size-base);
}

/* 结果卡片 */
.result-card {
  padding: var(--space-6) 0;
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
  margin-bottom: var(--space-2);
}

.result-detail {
  font-size: var(--font-size-base);
  color: var(--color-text-inverse-secondary);
  margin-bottom: var(--space-6);
}

.restart-btn {
  padding: var(--space-3) var(--space-8);
  font-size: var(--font-size-base);
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent));
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all 0.3s ease;
}

.restart-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3);
}

/* ===== 响应式 ===== */
@media (max-width: 480px) {
  .game-card-main { padding: var(--space-5); }
  .game-title { font-size: var(--font-size-2xl); }
  .guess-input { width: 110px; font-size: var(--font-size-lg); }
  .guess-btn { padding: var(--space-2) var(--space-4); }
}
</style>
