<template>
  <footer class="blog-footer">
    <p>{{ t('footer.text') }}</p>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.blog-footer {
  text-align: center;
  padding: var(--space-6);
  font-size: var(--font-size-sm);
  color: var(--color-text-inverse-tertiary);
  border-top: 1px solid var(--color-border-dark);
  background: var(--color-bg-dark);
}
</style>
