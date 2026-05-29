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
</style>
