<template>
  <ScrollReveal>
    <div class="music-player">
      <!-- 唱片机区域 -->
      <div class="record-player">
        <div class="tonearm" :class="{ playing: isPlaying }">
          <div class="tonearm-base"></div>
          <div class="tonearm-arm"></div>
          <div class="tonearm-head"></div>
        </div>
        <div class="vinyl-disc" :class="{ spinning: isPlaying }">
          <div class="disc-groove"></div>
          <div class="disc-groove"></div>
          <div class="disc-groove"></div>
          <div class="disc-groove"></div>
          <div class="disc-label">
            <span class="label-text">KOKO</span>
          </div>
          <div class="disc-hole"></div>
        </div>
      </div>

      <!-- 歌词区域 -->
      <div class="lyrics-panel">
        <div class="lyrics-title">告白气球 — 周杰伦</div>
        <div class="lyrics-window">
          <div class="lyrics-track" :style="{ transform: `translateY(${translateY}px)` }">
            <p
              v-for="(item, i) in lyrics"
              :key="i"
              class="lyric-line"
              :class="{ active: i === currentLyric }"
            >
              {{ item.text }}
            </p>
          </div>
        </div>
      </div>

      <button class="music-btn" @click="toggle">
        <span v-if="!isPlaying">▶ 播放</span>
        <span v-else>⏸ 暂停</span>
      </button>

      <audio
        ref="audio"
        loop
        autoplay
        :src="audioSrc"
        @error="onError"
        @timeupdate="onTimeUpdate"
        @play="isPlaying = true"
        @pause="isPlaying = false"
      ></audio>
    </div>
  </ScrollReveal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ScrollReveal from './ScrollReveal.vue'
import audioSrc from '@/assets/music/gaobaiqiqiu.mp3'
import lrcRaw from '@/assets/music/gaobaiqiqiu.lrc?raw'

const LINE_HEIGHT = 36
const WINDOW_HEIGHT = 280

const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)
const hasError = ref(false)
const currentLyric = ref(-1)

interface LyricItem {
  time: number
  text: string
}

// 解析 LRC 歌词文本：将 [mm:ss.xx] 时间戳和歌词文本转换为结构化数组
function parseLrc(raw: string): LyricItem[] {
  const lines = raw.split('\n')
  const result: LyricItem[] = []
  const timeRe = /^\[(\d{2}):(\d{2})\.(\d{2,3})\]/

  for (const line of lines) {
    const match = line.match(timeRe)
    if (!match) continue
    const mins = Number(match[1])
    const secs = Number(match[2])
    const ms = Number(match[3]) / (match[3].length === 2 ? 100 : 1000)
    const time = mins * 60 + secs + ms
    const text = line.slice(match[0].length).trim()
    if (text) {
      result.push({ time, text })
    }
  }
  return result
}

const lyrics = parseLrc(lrcRaw)

// 计算歌词轨道的纵向偏移量，使当前唱到的行始终居中在可视窗口内
const translateY = computed(() => {
  const target = currentLyric.value
  if (target < 0) return 0
  const center = WINDOW_HEIGHT / 2
  const activeTop = target * LINE_HEIGHT + LINE_HEIGHT / 2
  const offset = center - activeTop
  const maxOffset = 0
  const minOffset = WINDOW_HEIGHT - lyrics.length * LINE_HEIGHT
  if (offset > maxOffset) return maxOffset
  if (offset < minOffset) return minOffset
  return offset
})

// 切换播放/暂停状态
function toggle() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play().catch(() => { hasError.value = true })
  }
}

// 音频加载失败时的错误处理
function onError() {
  hasError.value = true
}

// 音频播放进度更新时，匹配当前时间对应的歌词行
function onTimeUpdate() {
  if (!audio.value) return
  const ct = audio.value.currentTime
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (ct >= lyrics[i].time) {
      currentLyric.value = i
      return
    }
  }
  currentLyric.value = -1
}
</script>

<style scoped>
.music-player {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  min-height: 90vh;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.03);
  overflow: hidden;
  flex-wrap: wrap;
}

/* ===== 唱片机 ===== */
.record-player {
  position: relative;
  width: 320px;
  height: 340px;
  flex-shrink: 0;
}

.tonearm {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 3;
  transform-origin: top right;
  transform: rotate(-25deg);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.tonearm.playing {
  transform: rotate(-8deg);
}

.tonearm-base {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle, #888, #444);
  margin: 0 auto;
}

.tonearm-arm {
  width: 4px;
  height: 130px;
  background: linear-gradient(to bottom, #999, #666);
  margin: 0 auto;
  border-radius: 2px;
}

.tonearm-head {
  width: 20px;
  height: 12px;
  background: linear-gradient(135deg, #777, #555);
  border-radius: 2px;
  margin: -2px auto 0;
  transform: rotate(-15deg);
}

.vinyl-disc {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    #1a1a2e 0%,
    #1a1a2e 10%,
    #222 10.5%,
    #1a1a2e 11%,
    #222 14%,
    #1a1a2e 14.5%,
    #222 17%,
    #1a1a2e 17.5%,
    #222 20%,
    #1a1a2e 20.5%,
    #222 23%,
    #1a1a2e 23.5%,
    #333 55%,
    #2a2a3a 60%,
    #1a1a2e 90%,
    #111 100%
  );
  box-shadow:
    0 0 30px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(100, 180, 255, 0.08),
    inset 0 0 20px rgba(0, 0, 0, 0.4);
}

.vinyl-disc.spinning {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

.disc-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e63946, #c1121f);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.label-text {
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.1em;
}

.disc-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #111;
}

/* ===== 歌词面板 ===== */
.lyrics-panel {
  width: 260px;
  flex-shrink: 0;
}

.lyrics-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-accent-cyan);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
  color: rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lyric-line.active {
  color: #fff;
  font-weight: 600;
  font-size: 17px;
  text-shadow: 0 0 12px rgba(100, 200, 255, 0.5);
}

/* ===== 播放按钮 ===== */
.music-btn {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
  padding: 10px 28px;
  border: 1px solid var(--color-accent);
  border-radius: 24px;
  color: var(--color-accent);
  font-size: 14px;
  background: rgba(10, 10, 26, 0.75);
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.music-btn:hover {
  background: var(--color-accent);
  color: #fff;
}
</style>
