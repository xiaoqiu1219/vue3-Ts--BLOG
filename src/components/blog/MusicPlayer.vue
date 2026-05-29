<template>
  <ScrollReveal>
    <div class="music-player">
      <div class="music-spectrum">
        <span v-for="i in 16" :key="i" class="bar" :style="barStyle(i)" :class="{ playing: isPlaying }"></span>
      </div>
      <button class="music-btn" @click="toggle">
        <span v-if="!isPlaying">▶ 播放音乐</span>
        <span v-else>⏸ 暂停</span>
      </button>
      <audio ref="audio" loop :src="audioSrc" @error="onError"></audio>
    </div>
  </ScrollReveal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScrollReveal from './ScrollReveal.vue'

const isPlaying = ref(false)
const audio = ref<HTMLAudioElement | null>(null)
const hasError = ref(false)

const audioSrc = ''

function barStyle(i: number) {
  const h = 12 + Math.sin(i * 0.7) * 20 + Math.random() * 8
  return { height: `${h}px`, animationDelay: `${i * 0.12}s` }
}

function toggle() {
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play().catch(() => { hasError.value = true })
  }
  isPlaying.value = !isPlaying.value
}

function onError() {
  hasError.value = true
}
</script>

<style scoped>
.music-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 90vh;
  background: rgba(255, 255, 255, 0.04);
}

.music-spectrum {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 60px;
}

.bar {
  width: 4px;
  border-radius: 2px;
  background: var(--color-accent);
  transition: height 0.2s ease;
}

.bar.playing {
  animation: bounce 0.8s ease-in-out infinite alternate;
}

@keyframes bounce {
  0% { transform: scaleY(0.4); background: var(--color-accent); }
  100% { transform: scaleY(1); background: var(--color-accent-cyan); }
}

.music-btn {
  padding: 10px 28px;
  border: 1px solid var(--color-accent);
  border-radius: 24px;
  color: var(--color-accent);
  font-size: 14px;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.music-btn:hover {
  background: var(--color-accent);
  color: #fff;
}
</style>
