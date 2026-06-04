<template>
  <div class="about-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <span class="page-badge">{{ t('about.badge') }}</span>
        <h1 class="page-title">{{ t('about.title') }}</h1>
        <p class="page-desc" v-html="$t_html('about.desc')"></p>
      </div>

      <!-- 演示卡片 -->
      <div class="demo-grid">
        <!-- 基础用法 -->
        <div class="demo-card">
          <div class="demo-card-header">
            <h3>{{ t('about.basic.title') }}</h3>
            <span class="demo-card-tag">v-model</span>
          </div>
          <div class="demo-card-body">
            <p class="demo-card-desc">{{ t('about.basic.desc') }}</p>
            <button class="btn btn-primary" @click="basicVisible = true">{{ t('about.basic.btn') }}</button>
          </div>
          <Modal
            v-model="basicVisible"
            :title="t('about.basic.modal.title')"
            @confirm="handleConfirm"
            @cancel="handleCancel"
          >
            <p>此弹窗通过 <code>v-model</code> 绑定在 <code>&lt;Modal&gt;</code> 标签上控制显隐。</p>
            <p style="margin-top:8px">支持插槽、属性配置和完整的事件处理。</p>
          </Modal>
        </div>

        <!-- 自定义配置 -->
        <div class="demo-card">
          <div class="demo-card-header">
            <h3>{{ t('about.custom.title') }}</h3>
            <span class="demo-card-tag">props</span>
          </div>
          <div class="demo-card-body">
            <p class="demo-card-desc">{{ t('about.custom.desc') }}</p>
            <button class="btn btn-primary" @click="customVisible = true">{{ t('about.custom.btn') }}</button>
          </div>
          <Modal
            v-model="customVisible"
            :title="t('about.custom.modal.title')"
            width="600"
            :confirm-text="t('about.custom.modal.confirm')"
            :cancel-text="t('about.custom.modal.cancel')"
            :show-close="false"
            :close-on-click-modal="false"
            @confirm="customVisible = false"
          >
            <div class="custom-content">
              <h4>{{ t('about.custom.setting') }}</h4>
              <ul>
                <li>{{ t('about.custom.item1') }}</li>
                <li>{{ t('about.custom.item2') }}</li>
                <li>{{ t('about.custom.item3') }}</li>
                <li>{{ t('about.custom.item4') }}</li>
              </ul>
            </div>
          </Modal>
        </div>

        <!-- 表单弹窗 -->
        <div class="demo-card">
          <div class="demo-card-header">
            <h3>{{ t('about.form.title') }}</h3>
            <span class="demo-card-tag">form</span>
          </div>
          <div class="demo-card-body">
            <p class="demo-card-desc">{{ t('about.form.desc') }}</p>
            <button class="btn btn-primary" @click="formVisible = true">{{ t('about.form.btn') }}</button>
          </div>
          <Modal v-model="formVisible" :title="t('about.form.modal.title')" :confirm-text="t('about.form.submit')" @confirm="handleSubmit">
            <form class="form-content" @submit.prevent>
              <div class="form-item">
                <label for="name">{{ t('about.form.name') }}</label>
                <input id="name" v-model="formData.name" type="text" placeholder="" />
              </div>
              <div class="form-item">
                <label for="email">{{ t('about.form.email') }}</label>
                <input id="email" v-model="formData.email" type="email" placeholder="" />
              </div>
            </form>
          </Modal>
        </div>

        <!-- 后端 API -->
        <div class="demo-card">
          <div class="demo-card-header">
            <h3>{{ t('about.api.title') }}</h3>
            <span class="demo-card-tag">api</span>
          </div>
          <div class="demo-card-body">
            <p class="demo-card-desc">{{ t('about.api.desc') }}</p>
            <button class="btn btn-primary" @click="fetchHello" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? t('about.api.loading') : t('about.api.btn') }}
            </button>
            <div v-if="helloResult" class="api-result">{{ helloResult }}</div>
            <div v-if="errorMessage" class="api-error">{{ t('about.api.error') }}</div>
          </div>
        </div>

        <!-- 底部/插槽 -->
        <div class="demo-card">
          <div class="demo-card-header">
            <h3>{{ t('about.slot.title') }}</h3>
            <span class="demo-card-tag">slots</span>
          </div>
          <div class="demo-card-body">
            <p class="demo-card-desc">{{ t('about.slot.desc') }}</p>
            <button class="btn btn-secondary" @click="basicVisible = true">{{ t('about.slot.btn') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal/Modal.vue'
import { getHello } from '@/api/backend'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()

// Helper to render HTML in translated strings
const $t_html = (key: string) => t(key)

const basicVisible = ref(false)
const customVisible = ref(false)
const formVisible = ref(false)

const formData = ref({ name: '', email: '' })

// 确认按钮回调
const handleConfirm = () => {
  console.log('Confirmed')
  basicVisible.value = false
}

// 取消按钮回调
const handleCancel = () => {
  console.log('Cancelled')
}

// 表单提交回调
const handleSubmit = () => {
  console.log('Submit:', formData.value)
  formVisible.value = false
  formData.value = { name: '', email: '' }
}

const helloResult = ref('')
const errorMessage = ref('')
const loading = ref(false)

// 调用后端 API 获取消息，处理加载中和错误状态
const fetchHello = async () => {
  loading.value = true
  errorMessage.value = ''
  helloResult.value = ''
  try {
    const data = await getHello()
    helloResult.value = data.message || JSON.stringify(data)
  } catch {
    errorMessage.value = t('about.api.error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.about-page {
  padding-bottom: var(--space-12);
}

/* 页面头部 */
.page-header {
  text-align: center;
  margin-bottom: var(--space-10);
}

.page-badge {
  display: inline-block;
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-primary-light);
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
  max-width: 520px;
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

/* 演示卡片网格 */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}

.demo-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: box-shadow var(--transition-base), border-color var(--transition-base);
}

.demo-card:hover {
  box-shadow: var(--shadow-md);
  border-color: transparent;
}

.demo-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  background: var(--color-surface-secondary);
  border-bottom: 1px solid var(--color-border);
}

.demo-card-header h3 {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.demo-card-tag {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-tertiary);
  background: var(--color-surface-tertiary);
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
}

.demo-card-body {
  padding: var(--space-6);
}

.demo-card-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-4);
  line-height: 1.6;
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
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

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

/* 加载动画 */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 自定义内容 */
.custom-content h4 {
  color: var(--color-primary);
  margin-bottom: var(--space-3);
  font-size: var(--font-size-base);
}

.custom-content ul {
  padding-left: var(--space-5);
}

.custom-content li {
  margin-bottom: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

/* 表单 */
.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form-item label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.form-item input {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-family: inherit;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-item input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

/* API 结果 */
.api-result {
  margin-top: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-success-light);
  color: var(--color-success);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.api-error {
  margin-top: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-error-light);
  color: var(--color-error);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-title {
    font-size: var(--font-size-3xl);
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }

  .demo-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
}

@media (max-width: 480px) {
  .page-header {
    margin-bottom: var(--space-6);
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }

  .page-desc {
    font-size: var(--font-size-sm);
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .demo-card-body {
    padding: var(--space-4);
  }

  .demo-card-header {
    padding: var(--space-3) var(--space-4);
  }

  .form-item input {
    font-size: var(--font-size-base); /* 防止 iOS 缩放 */
  }
}
</style>
