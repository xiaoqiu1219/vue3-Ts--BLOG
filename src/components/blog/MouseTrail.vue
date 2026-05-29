<template>
  <canvas ref="canvas" class="mouse-trail-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number }> = []
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
  for (let i = 0; i < 4; i++) {
    particles.push({
      x: mouseX + (Math.random() - 0.5) * 12,
      y: mouseY + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      life: 0,
      maxLife: 40 + Math.random() * 40,
      size: 10 + Math.random() * 12,
      hue: 200 + Math.random() * 40
    })
  }
}

function animate() {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  ctx.globalCompositeOperation = 'lighter'

  particles = particles.filter(p => p.life < p.maxLife)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.life++
    const progress = p.life / p.maxLife
    const alpha = 1 - progress
    const radius = p.size * (1 - progress * 0.5)

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
    gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${alpha})`)
    gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, ${alpha * 0.6})`)
    gradient.addColorStop(1, `hsla(${p.hue}, 100%, 50%, 0)`)

    ctx.beginPath()
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
    ctx.fillStyle = gradient
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'
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
