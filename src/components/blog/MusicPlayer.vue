<template>
  <ScrollReveal>
    <div class="music-player">
      <!-- 玻璃拟态卡片 -->
      <div class="player-card">
        <!-- 唱片机区域 -->
        <div class="record-player">
          <!-- 唱臂 -->
          <div class="tonearm" :class="{ playing: store.isPlaying }">
            <div class="tonearm-base">
              <div class="base-pivot"></div>
            </div>
            <div class="tonearm-shaft">
              <div class="counterweight"></div>
              <div class="tonearm-arm"></div>
            </div>
            <div class="tonearm-head">
              <div class="head-cartridge"></div>
              <div class="head-needle"></div>
            </div>
          </div>

          <!-- 唱片 -->
          <div class="vinyl-stage">
            <!-- 脉冲光环 -->
            <div class="pulse-ring" :class="{ active: store.isPlaying }"></div>
            <div class="pulse-ring delay" :class="{ active: store.isPlaying }"></div>

            <div class="vinyl-disc" :class="{ spinning: store.isPlaying }">
              <!-- 唱片纹理 -->
              <div class="disc-grooves"></div>
              <!-- 高光反射 -->
              <div class="disc-shine"></div>
              <!-- 中心标签 -->
              <div class="disc-label">
                <div class="label-inner">
                  <span class="label-brand">KOKO</span>
                  <span class="label-sub">RECORDS</span>
                  <span class="label-rpm">33⅓ RPM</span>
                </div>
              </div>
              <!-- 中心孔 -->
              <div class="disc-hole"></div>
            </div>
          </div>
        </div>

        <!-- 歌词面板 -->
        <div class="lyrics-panel">
          <div class="lyrics-header">
            <span class="lyrics-title">告白气球</span>
            <span class="lyrics-artist">周杰伦</span>
          </div>
          <div class="lyrics-window">
            <div class="lyrics-track" :style="{ transform: `translateY(${translateY}px)` }">
              <p
                v-for="(item, i) in store.lyrics"
                :key="i"
                class="lyric-line"
                :class="{ active: i === store.currentLyric }"
              >
                {{ item.text }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 播放控制 -->
      <button class="music-btn" @click="store.toggle()">
        <span class="btn-icon" v-if="!store.isPlaying">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5v11l9-5.5z"/></svg>
        </span>
        <span class="btn-icon" v-else>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="2" width="4" height="12" rx="1"/><rect x="9" y="2" width="4" height="12" rx="1"/></svg>
        </span>
        <span class="btn-text">{{ store.isPlaying ? '暂停' : '播放' }}</span>
      </button>
    </div>
  </ScrollReveal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ScrollReveal from './ScrollReveal.vue'
import { useMusicStore } from '@/stores/music'

const WINDOW_HEIGHT = 280
const store = useMusicStore()

// 计算歌词轨道的纵向偏移量，使当前唱到的行始终居中在可视窗口内
const translateY = computed(() => {
  const target = store.currentLyric
  if (target < 0) return 0
  const center = WINDOW_HEIGHT / 2
  const activeTop = target * store.LINE_HEIGHT + store.LINE_HEIGHT / 2
  const offset = center - activeTop
  const maxOffset = 0
  const minOffset = WINDOW_HEIGHT - store.lyrics.length * store.LINE_HEIGHT
  if (offset > maxOffset) return maxOffset
  if (offset < minOffset) return minOffset
  return offset
})
</script>

<style scoped>
/* ===== 整体布局 ===== */
.music-player {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  padding: 40px 20px;
  overflow: hidden;
}

/* ===== 玻璃拟态卡片 ===== */
.player-card {
  display: flex;
  align-items: center;
  gap: 64px;
  padding: 48px 56px;
  background: rgba(15, 15, 42, 0.45);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  flex-wrap: wrap;
  justify-content: center;
}

/* ===== H5 移动端适配 ===== */
@media (max-width: 768px) {
  .music-player {
    min-height: auto;
    padding: 32px 16px;
  }

  .player-card {
    flex-direction: column;
    gap: 32px;
    padding: 32px 24px;
    width: 100%;
    max-width: 400px;
  }

  .record-player {
    width: 260px;
    height: 280px;
  }

  .vinyl-stage {
    width: 230px;
    height: 230px;
  }

  .disc-label {
    width: 80px;
    height: 80px;
  }

  .lyrics-panel {
    width: 100%;
  }

  .lyrics-header {
    justify-content: center;
  }

  .lyrics-window {
    height: 200px;
  }

  .lyric-line {
    text-align: center;
  }

  .music-btn {
    margin-top: 24px;
  }
}

@media (max-width: 480px) {
  .music-player {
    padding: 24px 12px;
  }

  .player-card {
    padding: 24px 16px;
    gap: 24px;
  }

  .record-player {
    width: 220px;
    height: 240px;
  }

  .vinyl-stage {
    width: 200px;
    height: 200px;
  }

  .disc-label {
    width: 68px;
    height: 68px;
  }

  /* 缩小唱臂尺寸 */
  .tonearm-arm {
    height: 95px;
  }

  .label-brand {
    font-size: 14px;
  }

  .label-sub {
    font-size: 6px;
  }

  .label-rpm {
    font-size: 5px;
  }

  .lyrics-window {
    height: 160px;
  }

  .lyric-line {
    height: 32px;
    line-height: 32px;
  }

  .lyric-line.active {
    font-size: 15px;
  }
}

/* ===== 唱片机 ===== */
.record-player {
  position: relative;
  width: 340px;
  height: 360px;
  flex-shrink: 0;
}

/* --- 唱臂 --- */
.tonearm {
  position: absolute;
  top: 8px;
  right: 24px;
  z-index: 5;
  transform-origin: top right;
  transform: rotate(-28deg);
  transition: transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.tonearm.playing {
  transform: rotate(-6deg);
}

.tonearm-base {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle at 60% 40%, #b0b0b0, #555 60%, #333);
  margin: 0 auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

.base-pivot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #222;
  margin: 7px auto;
}

.tonearm-shaft {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.counterweight {
  width: 12px;
  height: 8px;
  background: linear-gradient(to bottom, #999, #555);
  border-radius: 3px;
  margin-bottom: 2px;
}

.tonearm-arm {
  width: 3px;
  height: 125px;
  background: linear-gradient(
    to bottom,
    #ccc 0%,
    #999 20%,
    #777 80%,
    #555 100%
  );
  border-radius: 2px;
}

.tonearm-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -2px;
}

.head-cartridge {
  width: 22px;
  height: 14px;
  background: linear-gradient(135deg, #888, #555);
  border-radius: 3px;
  transform: rotate(-12deg);
}

.head-needle {
  width: 1.5px;
  height: 10px;
  background: linear-gradient(to bottom, #ccc, #999);
  border-radius: 1px;
  transform: rotate(-8deg);
  margin-top: -1px;
}

/* --- 唱片舞台 --- */
.vinyl-stage {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 300px;
}

/* 脉冲光环 */
.pulse-ring {
  position: absolute;
  inset: -12px;
  border-radius: 50%;
  border: 1.5px solid rgba(6, 182, 212, 0);
  opacity: 0;
  transition: all 0.6s ease;
}

.pulse-ring.active {
  animation: pulse-ring 2.5s ease-out infinite;
  border-color: rgba(6, 182, 212, 0.25);
}

.pulse-ring.delay.active {
  animation: pulse-ring 2.5s ease-out 1.25s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.92);
    opacity: 0.7;
    border-color: rgba(6, 182, 212, 0.3);
  }
  100% {
    transform: scale(1.12);
    opacity: 0;
    border-color: rgba(6, 182, 212, 0);
  }
}

/* --- 唱片 --- */
.vinyl-disc {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at 45% 40%,
    #2a2a3e 0%,
    #1a1a2e 25%,
    #16162a 50%,
    #111 100%
  );
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(100, 180, 255, 0.05),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
}

.vinyl-disc.spinning {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 唱片纹理槽 */
.disc-grooves {
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: repeating-radial-gradient(
    circle at center,
    transparent 0px,
    transparent 2.5px,
    rgba(255, 255, 255, 0.015) 2.5px,
    rgba(255, 255, 255, 0.015) 3.5px,
    transparent 3.5px,
    transparent 6px
  );
  mask-image: radial-gradient(
    circle at center,
    black 15%,
    black 98%,
    transparent 100%
  );
}

/* 高光反射 */
.disc-shine {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    from 30deg,
    transparent 0deg,
    transparent 30deg,
    rgba(255, 255, 255, 0.04) 45deg,
    rgba(255, 255, 255, 0.07) 55deg,
    rgba(255, 255, 255, 0.04) 65deg,
    transparent 80deg,
    transparent 360deg
  );
  pointer-events: none;
}

/* 中心标签 */
.disc-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e63946 0%, #c1121f 40%, #a4161a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.label-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.label-brand {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.15em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.label-sub {
  font-size: 7px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.label-rpm {
  font-size: 6px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  margin-top: 1px;
}

/* 中心孔 */
.disc-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a0a1a;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  z-index: 2;
}

/* ===== 歌词面板 ===== */
.lyrics-panel {
  width: 260px;
  flex-shrink: 0;
}

.lyrics-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.lyrics-title {
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
}

.lyrics-artist {
  font-size: 12px;
  color: var(--color-accent-cyan);
  opacity: 0.8;
}

.lyrics-window {
  height: 280px;
  overflow: hidden;
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 20%,
    black 80%,
    transparent 100%
  );
}

.lyrics-track {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.lyric-line {
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.25);
  transition: all 0.4s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
}

.lyric-line.active {
  color: #fff;
  font-weight: 600;
  font-size: 17px;
  text-shadow:
    0 0 12px rgba(6, 182, 212, 0.4),
    0 0 24px rgba(6, 182, 212, 0.15);
  background: linear-gradient(
    90deg,
    rgba(6, 182, 212, 0.08),
    transparent
  );
  border-radius: 6px;
}

/* ===== 播放按钮 ===== */
.music-btn {
  margin-top: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: 28px;
  color: var(--color-accent);
  font-size: 15px;
  font-weight: 500;
  background: rgba(10, 10, 26, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.music-btn:hover {
  border-color: var(--color-accent);
  background: rgba(59, 130, 246, 0.15);
  box-shadow:
    0 4px 20px rgba(59, 130, 246, 0.2),
    0 0 40px rgba(59, 130, 246, 0.05);
  transform: translateY(-1px);
}

.music-btn:active {
  transform: translateY(0) scale(0.97);
  transition: all 0.1s ease;
}

.btn-icon {
  display: flex;
  align-items: center;
}

.btn-text {
  letter-spacing: 0.05em;
}
</style>
