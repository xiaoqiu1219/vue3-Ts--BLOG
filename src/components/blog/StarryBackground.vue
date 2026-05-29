<template>
  <div class="starry-bg" ref="container">
    <div class="stars stars-small"></div>
    <div class="stars stars-medium"></div>
    <div class="stars stars-large"></div>
    <div class="shooting-star" v-for="i in 3" :key="i" :style="shootingStyle(i)"></div>
  </div>
</template>

<script setup lang="ts">
function shootingStyle(i: number) {
  const top = 10 + i * 25 + Math.random() * 15
  const delay = i * 4 + Math.random() * 3
  const left = 20 + i * 20 + Math.random() * 30
  return {
    top: `${top}%`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${2 + Math.random() * 2}s`
  }
}
</script>

<style scoped>
.starry-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.stars {
  position: absolute;
  inset: 0;
}

.stars-small {
  background-image:
    radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 25% 35%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 40% 8%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 55% 42%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 70% 18%, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 85% 55%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 15% 70%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 60% 65%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 90% 85%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 8% 50%, rgba(255,255,255,0.5), transparent),
    radial-gradient(1px 1px at 48% 78%, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 75% 72%, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 22% 22%, rgba(255,255,255,0.7), transparent),
    radial-gradient(1px 1px at 93% 10%, rgba(255,255,255,0.8), transparent);
  animation: twinkle 4s ease-in-out infinite alternate;
}

.stars-medium {
  background-image:
    radial-gradient(2px 2px at 18% 25%, rgba(180,200,255,0.8), transparent),
    radial-gradient(2px 2px at 50% 12%, rgba(255,255,255,0.9), transparent),
    radial-gradient(2px 2px at 72% 38%, rgba(180,200,255,0.7), transparent),
    radial-gradient(2px 2px at 33% 58%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 88% 70%, rgba(180,200,255,0.6), transparent),
    radial-gradient(2px 2px at 12% 82%, rgba(255,255,255,0.7), transparent),
    radial-gradient(2px 2px at 62% 85%, rgba(180,200,255,0.8), transparent),
    radial-gradient(2px 2px at 45% 45%, rgba(255,255,255,0.5), transparent);
  animation: twinkle 5s ease-in-out infinite alternate-reverse;
}

.stars-large {
  background-image:
    radial-gradient(3px 3px at 30% 20%, rgba(200,220,255,0.9), transparent),
    radial-gradient(3px 3px at 65% 30%, rgba(255,255,255,0.7), transparent),
    radial-gradient(3px 3px at 80% 60%, rgba(200,220,255,0.8), transparent),
    radial-gradient(3px 3px at 15% 45%, rgba(255,255,255,0.6), transparent),
    radial-gradient(3px 3px at 55% 75%, rgba(200,220,255,0.7), transparent);
  animation: twinkle 6s ease-in-out infinite alternate;
}

@keyframes twinkle {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

.shooting-star {
  position: absolute;
  width: 120px;
  height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.8), transparent);
  border-radius: 50%;
  animation: shoot linear infinite;
  opacity: 0;
}

@keyframes shoot {
  0% {
    opacity: 0;
    transform: translateX(0) translateY(0) rotate(-35deg);
  }
  5% {
    opacity: 1;
  }
  10% {
    opacity: 0;
    transform: translateX(-200px) translateY(100px) rotate(-35deg);
  }
  100% {
    opacity: 0;
    transform: translateX(-200px) translateY(100px) rotate(-35deg);
  }
}
</style>
