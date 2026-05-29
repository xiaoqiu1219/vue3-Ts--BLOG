<template>
  <div ref="el" class="scroll-reveal" :class="{ revealed: isRevealed }" :style="{ transitionDelay: `${delay}ms` }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

defineProps<{ delay?: number }>()

const el = ref<HTMLElement | null>(null)
const isRevealed = ref(false)
let st: ScrollTrigger | null = null

onMounted(async () => {
  await nextTick()
  if (!el.value) return
  st = ScrollTrigger.create({
    trigger: el.value,
    start: 'top 85%',
    onEnter: () => { isRevealed.value = true },
    onLeave: () => { isRevealed.value = false },
    onEnterBack: () => { isRevealed.value = true },
    onLeaveBack: () => { isRevealed.value = false },
  })
  ScrollTrigger.refresh()
})

onUnmounted(() => {
  st?.kill()
})
</script>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>
