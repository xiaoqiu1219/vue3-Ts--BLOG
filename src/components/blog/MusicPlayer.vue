<template>
  <ScrollReveal>
    <div class="music-player">
      <div class="music-spectrum">
        <span
          v-for="i in 50"
          :key="i"
          class="bar"
          :class="{ playing: isPlaying }"
          :style="{
            '--h1': `${5 + Math.sin(i * 0.5) * 10 + Math.random() * 15}%`,
            '--h2': `${50 + Math.cos(i * 0.35) * 30 + Math.random() * 40}%`,
            animationDuration: `${0.8 + Math.random() * 1.4}s`,
            animationDelay: `${i * 0.15 + Math.random() * 0.3}s`,
          }"
        ></span>
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-height: 90vh;
  background: rgba(255, 255, 255, 0.04);
  overflow: hidden;
}

.music-spectrum {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  padding: 0 2%;
}

.bar {
  flex: 1;
  border-radius: 2px 2px 0 0;
  background: linear-gradient(to top, var(--color-accent-cyan), var(--color-accent));
  transition: height 0.5s ease;
  min-height: 2%;
}

.bar.playing {
  animation: wave linear infinite alternate;
}

@keyframes wave {
  0% {
    height: var(--h1);
  }
  100% {
    height: var(--h2);
  }
}

.music-btn {
  position: relative;
  z-index: 2;
  margin-bottom: 40px;
  padding: 12px 32px;
  border: 1px solid var(--color-accent);
  border-radius: 24px;
  color: var(--color-accent);
  font-size: 14px;
  background: rgba(10, 10, 26, 0.7);
  backdrop-filter: blur(4px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.music-btn:hover {
  background: var(--color-accent);
  color: #fff;
}
</style>
