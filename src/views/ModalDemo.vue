<template>
  <div class="modal-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <span class="page-badge">{{ t('modal.badge') }}</span>
        <h1 class="page-title">{{ t('modal.title') }}</h1>
        <p class="page-desc" v-html="$t_html('modal.desc')"></p>
      </div>

      <!-- Section: Basic Types -->
      <section class="demo-section">
        <h2 class="section-title">{{ t('modal.basic') }}</h2>
        <div class="btn-group">
          <button class="btn btn-primary" @click="showBasicModal">{{ t('modal.basic.btn') }}</button>
          <button class="btn btn-success" @click="showConfirmModal">{{ t('modal.basic.confirm') }}</button>
          <button class="btn btn-secondary" @click="showInfoModal">{{ t('modal.basic.info') }}</button>
        </div>
      </section>

      <!-- Section: Alert Types -->
      <section class="demo-section">
        <h2 class="section-title">{{ t('modal.alert') }}</h2>
        <div class="btn-group">
          <button class="btn btn-warning" @click="showWarningModal">{{ t('modal.alert.warning') }}</button>
          <button class="btn btn-error" @click="showErrorModal">{{ t('modal.alert.error') }}</button>
        </div>
      </section>

      <!-- Section: Content Types -->
      <section class="demo-section">
        <h2 class="section-title">{{ t('modal.content') }}</h2>
        <div class="btn-group">
          <button class="btn btn-secondary" @click="showHtmlModal">{{ t('modal.content.html') }}</button>
          <button class="btn btn-secondary" @click="showVNodeModal">{{ t('modal.content.vnode') }}</button>
        </div>
      </section>

      <!-- Section: Advanced -->
      <section class="demo-section">
        <h2 class="section-title">{{ t('modal.advanced') }}</h2>
        <div class="btn-group">
          <button class="btn btn-secondary" @click="showAsyncModal">{{ t('modal.advanced.async') }}</button>
          <button class="btn btn-secondary" @click="showCustomModal">{{ t('modal.advanced.custom') }}</button>
          <button class="btn btn-outline" @click="closeAllModals">{{ t('modal.advanced.closeAll') }}</button>
        </div>
      </section>

      <!-- API Reference -->
      <section class="demo-section">
        <h2 class="section-title">{{ t('modal.api.ref') }}</h2>
        <div class="api-grid">
          <div class="api-card">
            <code class="api-signature">modal.show(options)</code>
            <p>{{ t('modal.api.show') }}</p>
          </div>
          <div class="api-card">
            <code class="api-signature">modal.confirm(message, title?)</code>
            <p>{{ t('modal.api.confirm') }}</p>
          </div>
          <div class="api-card">
            <code class="api-signature">modal.info(message, title?)</code>
            <p>{{ t('modal.api.info') }}</p>
          </div>
          <div class="api-card">
            <code class="api-signature">modal.warning(message, title?)</code>
            <p>{{ t('modal.api.warning') }}</p>
          </div>
          <div class="api-card">
            <code class="api-signature">modal.error(message, title?)</code>
            <p>{{ t('modal.api.error') }}</p>
          </div>
          <div class="api-card">
            <code class="api-signature">modal.closeAll()</code>
            <p>{{ t('modal.api.closeAll') }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { modal } from '@/components/Modal'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const $t_html = (key: string) => t(key)

// 显示基础弹窗，支持确认/取消回调并打印结果
const showBasicModal = async () => {
  const result = await modal.show({
    title: t('modal.basic.btn'),
    content: t('modal.basic.content'),
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled'),
  })
  console.log('Result:', result)
}

// 显示确认弹窗，用户点击确定或取消
const showConfirmModal = async () => {
  const result = await modal.confirm(t('modal.confirm.content'), t('modal.confirm.title'))
  console.log(result ? 'User confirmed' : 'User cancelled')
}

// 显示信息提示弹窗，仅有关闭按钮
const showInfoModal = async () => {
  await modal.info(t('modal.info.content'))
}

// 显示警告类型弹窗，带警告样式
const showWarningModal = async () => {
  await modal.warning(t('modal.warning.content'))
}

// 显示错误类型弹窗，带错误样式
const showErrorModal = async () => {
  await modal.error(t('modal.error.content'))
}

// 显示带 HTML 内容的弹窗，包含表格等富文本
const showHtmlModal = async () => {
  await modal.show({
    title: t('modal.html.title'),
    content: `
      <div style="padding: 4px;">
        <h4 style="margin-bottom: 10px; color: #2563eb;">${t('modal.html.h4')}</h4>
        <p style="margin-bottom: 8px;">${t('modal.html.desc')}</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><th style="border:1px solid #e2e8f0;padding:8px;background:#f8fafc;">${t('modal.html.prop')}</th><th style="border:1px solid #e2e8f0;padding:8px;background:#f8fafc;">${t('modal.html.val')}</th></tr>
          <tr><td style="border:1px solid #e2e8f0;padding:8px;">Version</td><td style="border:1px solid #e2e8f0;padding:8px;">1.0.0</td></tr>
          <tr><td style="border:1px solid #e2e8f0;padding:8px;">License</td><td style="border:1px solid #e2e8f0;padding:8px;">MIT</td></tr>
        </table>
      </div>
    `,
  })
}

// 显示带 VNode 内容的弹窗，使用 h() 函数渲染响应式组件
const showVNodeModal = async () => {
  const vnode = h('div', { style: { padding: '4px' } }, [
    h('h4', { style: { color: '#16a34a', marginBottom: '10px' } }, t('modal.vnode.h4')),
    h('p', { style: { marginBottom: '8px' } }, t('modal.vnode.desc')),
    h('div', { style: { display: 'flex', gap: '8px', marginTop: '10px' } }, [
      h('span', { style: { padding: '4px 12px', background: '#dbeafe', borderRadius: '4px', fontSize: '13px' } }, 'Tag 1'),
      h('span', { style: { padding: '4px 12px', background: '#fef3c7', borderRadius: '4px', fontSize: '13px' } }, 'Tag 2'),
      h('span', { style: { padding: '4px 12px', background: '#dcfce7', borderRadius: '4px', fontSize: '13px' } }, 'Tag 3'),
    ]),
  ])

  await modal.show({ title: t('modal.vnode.title'), content: vnode, width: 500 })
}

// 显示异步操作弹窗，确认后模拟 2 秒延迟
const showAsyncModal = async () => {
  const result = await modal.show({
    title: t('modal.async.title'),
    content: t('modal.async.content'),
    onConfirm: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Async operation completed')
    },
  })
  if (result) console.log('Operation successful')
}

// 显示自定义配置弹窗：宽度 600px、不可点击遮罩关闭、无关闭按钮
const showCustomModal = async () => {
  await modal.show({
    title: t('modal.custom.title'),
    content: t('modal.custom.content'),
    width: 600,
    closeOnClickModal: false,
    showClose: false,
    confirmText: t('modal.custom.confirm'),
    cancelText: t('modal.custom.cancel'),
    customStyle: { borderRadius: '12px' },
  })
}

// 一键关闭当前所有打开的弹窗
const closeAllModals = () => {
  modal.closeAll()
}
</script>

<style scoped>
.modal-page {
  padding-bottom: var(--space-12);
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: var(--space-10);
}

.page-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-warning);
  background: var(--color-warning-light);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 800;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  letter-spacing: -0.03em;
}

.page-desc {
  max-width: 600px;
  margin: 0 auto;
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.page-desc :deep(code) {
  padding: 2px 6px;
  background: var(--color-surface-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 0.9em;
  font-family: var(--font-mono);
  color: var(--color-primary);
}

/* Sections */
.demo-section {
  margin-bottom: var(--space-10);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}

.btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  min-height: 44px;
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-success {
  background: var(--color-success);
  color: var(--color-text-inverse);
  box-shadow: 0 1px 3px rgba(22, 163, 74, 0.3);
}

.btn-success:hover {
  background: #15803d;
  transform: translateY(-1px);
}

.btn-success:active {
  transform: translateY(0);
}

.btn-warning {
  background: var(--color-warning);
  color: var(--color-text-inverse);
  box-shadow: 0 1px 3px rgba(217, 119, 6, 0.3);
}

.btn-warning:hover {
  background: #b45309;
  transform: translateY(-1px);
}

.btn-warning:active {
  transform: translateY(0);
}

.btn-error {
  background: var(--color-error);
  color: var(--color-text-inverse);
  box-shadow: 0 1px 3px rgba(220, 38, 38, 0.3);
}

.btn-error:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.btn-error:active {
  transform: translateY(0);
}

.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-surface-tertiary);
  border-color: var(--color-border-hover);
}

.btn-outline {
  background: transparent;
  color: var(--color-text-tertiary);
  border: 1px solid var(--color-border);
}

.btn-outline:hover {
  color: var(--color-text-primary);
  border-color: var(--color-border-hover);
  background: var(--color-surface-tertiary);
}

/* API Reference Grid */
.api-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.api-card {
  padding: var(--space-4) var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: box-shadow var(--transition-base);
}

.api-card:hover {
  box-shadow: var(--shadow-sm);
}

.api-signature {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  margin-bottom: var(--space-2);
  font-weight: 600;
}

.api-card p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.api-card p :deep(code) {
  padding: 1px 4px;
  background: var(--color-surface-tertiary);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.9em;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }

  .api-grid {
    grid-template-columns: 1fr;
  }

  .btn-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
