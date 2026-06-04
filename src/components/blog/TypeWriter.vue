<template>
  <ScrollReveal>
    <div class="typewriter">
      <p class="typewriter-text">
        <span class="typed">{{ displayedText }}</span>
        <span class="cursor" :class="{ blink: done }">|</span>
      </p>
    </div>
  </ScrollReveal>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ScrollReveal from './ScrollReveal.vue'

const props = withDefaults(defineProps<{ text?: string; speed?: number }>(), {
  text: '长风破浪会有时，直挂云帆济沧海。',
  speed: 120
})

const displayedText = ref('')
const done = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  let i = 0
  // 定时逐字打印文本，完成后显示闪烁光标
  timer = setInterval(() => {
    if (i < props.text.length) {
      displayedText.value += props.text[i]
      i++
    } else {
      done.value = true
      if (timer) clearInterval(timer)
    }
  }, props.speed)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.typewriter {
  text-align: center;
  padding: 60px 0;
}

.typewriter-text {
  font-size: 24px;
  color: var(--color-text-inverse-secondary);
  letter-spacing: 0.05em;
  font-family: var(--font-sans);
}

.typed {
  color: var(--color-text);
}

.cursor {
  color: var(--color-accent);
  font-weight: 300;
}

.cursor.blink {
  animation: blink-cursor 0.8s step-end infinite;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ===== H5 移动端适配 ===== */
@media (max-width: 768px) {
  .typewriter {
    padding: 40px 16px;
  }

  .typewriter-text {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .typewriter {
    padding: 32px 12px;
  }

  .typewriter-text {
    font-size: 17px;
  }
}
</style>
