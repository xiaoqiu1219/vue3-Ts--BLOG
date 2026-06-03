<template>
  <ScrollReveal :delay="delay">
    <div class="section-card">
      <slot></slot>
    </div>
  </ScrollReveal>
</template>

<script setup lang="ts">
import ScrollReveal from './ScrollReveal.vue'

withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })
</script>

<style scoped>
.section-card {
  background: var(--color-bg-dark-secondary);
  border: 1px solid var(--color-border-dark);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
}

/* ===== H5 移动端适配 ===== */
@media (max-width: 768px) {
  .section-card {
    padding: var(--space-5);
  }
}

@media (max-width: 480px) {
  .section-card {
    padding: var(--space-4);
  }
}
</style>
