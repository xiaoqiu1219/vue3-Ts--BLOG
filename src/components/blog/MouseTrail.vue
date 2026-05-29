<template>
  <canvas ref="canvas" class="mouse-trail-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }> = []
let mouseX = -100
let mouseY = -100
let rafId = 0

function resize() {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
  for (let i = 0; i < 2; i++) {
    particles.push({
      x: mouseX + (Math.random() - 0.5) * 10,
      y: mouseY + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 0,
      maxLife: 30 + Math.random() * 30,
      size: 1 + Math.random() * 2.5
    })
  }
}

function animate() {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

  particles = particles.filter(p => p.life < p.maxLife)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.life++
    const alpha = 1 - p.life / p.maxLife
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.7})`
    ctx.fill()
  }
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouseMove)
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.mouse-trail-canvas {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
</style>
