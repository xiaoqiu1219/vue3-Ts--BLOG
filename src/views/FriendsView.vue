<template>
  <div class="placeholder-page">
    <h1>{{ t('friends.title') }}</h1>
    <p>{{ t('friends.coming') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.placeholder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--color-text-inverse-secondary);
  background: var(--color-bg-dark);
}
.placeholder-page h1 {
  font-size: var(--font-size-3xl);
  color: var(--color-heading);
  margin-bottom: var(--space-4);
}
</style>
