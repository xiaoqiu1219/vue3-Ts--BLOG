<template>
  <div class="admin-page">
    <div class="admin-container">
      <!-- 页面标题 -->
      <h2 class="admin-title">{{ t('admin.title') }}</h2>

      <!-- 搜索区 -->
      <SearchForm
        :searching="loading"
        @search="handleSearch"
        @reset="handleReset"
      >
        <!-- 输入框搜索 -->
        <input
          v-model="formData.search"
          type="text"
          :placeholder="t('admin.searchPlaceholder')"
          style="width: 240px"
          @keyup.enter="handleSearch"
        />

        <!-- 虚拟下拉搜索（角色） -->
        <VirtualDropdown
          v-model="formData.role"
          :options="roleOptions"
          :placeholder="t('admin.rolePlaceholder')"
          style="width: 160px"
        />

        <!-- 虚拟下拉搜索（状态） -->
        <VirtualDropdown
          v-model="formData.status"
          :options="statusOptions"
          :placeholder="t('admin.statusPlaceholder')"
          style="width: 120px"
        />

        <!-- 日期范围 -->
        <input v-model="formData.dateStart" type="date" :title="t('admin.dateStart')" />
        <span style="color: #909399; line-height: 36px">—</span>
        <input v-model="formData.dateEnd" type="date" :title="t('admin.dateEnd')" />
      </SearchForm>

      <!-- 表格区 -->
      <VirtualTable
        :data="tableData"
        :columns="tableColumns"
        :loading="loading"
        :row-height="48"
        :max-height="500"
      >
        <!-- 行渲染插槽（表头由 VirtualTable 根据 columns.label 自动渲染） -->
        <template #table-row="{ row }">
          <td style="width: 80px">{{ row.id }}</td>
          <td style="width: 140px">{{ row.name }}</td>
          <td style="width: 200px">{{ row.email }}</td>
          <td style="width: 100px">
            <span
              class="role-tag"
              :class="{ 'role-admin': row.role === 'admin' }"
            >
              {{ roleLabels[row.role] ?? row.role }}
            </span>
          </td>
          <td style="width: 80px">
            <span
              class="status-dot"
              :class="row.status === 'enabled' ? 'status-on' : 'status-off'"
            ></span>
            {{ statusLabels[row.status] ?? row.status }}
          </td>
          <td style="width: 120px">{{ row.department }}</td>
          <td style="width: 100px">{{ row.city }}</td>
          <td style="width: 140px">{{ row.createdAt }}</td>
        </template>
      </VirtualTable>

      <!-- 分页器 -->
      <Pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[20, 50, 100, 500]"
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSearch } from '@/composables/useSearch'
import { useTable } from '@/composables/useTable'
import SearchForm from '@/components/admin/SearchForm.vue'
import VirtualDropdown from '@/components/admin/VirtualDropdown.vue'
import VirtualTable from '@/components/admin/VirtualTable.vue'
import Pagination from '@/components/admin/Pagination.vue'
import {
  mockFetchUsers,
  fetchUsers,
  USER_ROLES,
  USER_STATUSES,
  type AdminUser,
} from '@/api/admin'
import type { PageResult, PageParams } from '@/composables/useTable'

const { t } = useI18n()

// ===== 表格列定义 =====
// label 同样走 i18n，保证 VirtualTable 默认表头（未用插槽时）也能切换语言
const tableColumns = computed(() => [
  { key: 'id', label: t('admin.col.id'), width: '80px' },
  { key: 'name', label: t('admin.col.name'), width: '140px' },
  { key: 'email', label: t('admin.col.email'), width: '200px' },
  { key: 'role', label: t('admin.col.role'), width: '100px' },
  { key: 'status', label: t('admin.col.status'), width: '80px' },
  { key: 'department', label: t('admin.col.department'), width: '120px' },
  { key: 'city', label: t('admin.col.city'), width: '100px' },
  { key: 'createdAt', label: t('admin.col.createdAt'), width: '140px' },
])

// ===== 下拉选项数据 =====
// value 是稳定的机器值，label 是当前语言的展示文本；选项与行内标签共用同一份数据
const roleOptions = computed(() =>
  USER_ROLES.map((value) => ({ label: t('admin.role.' + value), value })),
)

const statusOptions = computed(() =>
  USER_STATUSES.map((value) => ({ label: t('admin.status.' + value), value })),
)

// 行内渲染用映射表，避免虚拟表格每次滚动都重复解析 i18n key；
// 用 Record<string, string> 让后端返回未知值时仍能回退为原始文本
const roleLabels = computed(() =>
  Object.fromEntries(roleOptions.value.map((o) => [o.value, o.label])) as Record<string, string>,
)

const statusLabels = computed(() =>
  Object.fromEntries(statusOptions.value.map((o) => [o.value, o.label])) as Record<string, string>,
)

// ===== 数据获取器：按环境变量切换 mock / 真实 API =====
const resolvedFetcher =
  import.meta.env.VITE_USE_MOCK === 'true'
    ? mockFetchUsers
    : fetchUsers

// ===== 搜索逻辑 =====
const { formData, searchParams, search: triggerSearch, reset: triggerReset } = useSearch({
  search: '',
  role: '',
  status: '',
  dateStart: '',
  dateEnd: '',
})

// ===== 表格逻辑 =====
const {
  data: tableData,
  loading,
  total,
  page,
  pageSize,
  fetch,
  onPageChange: tablePageChange,
} = useTable<AdminUser>(resolvedFetcher as (params: PageParams) => Promise<PageResult<AdminUser>>)

// ===== 事件处理 =====
function handleSearch() {
  triggerSearch()
}

function handleReset() {
  triggerReset()
}

function onPageChange({ page: p, pageSize: ps }: { page: number; pageSize: number }) {
  tablePageChange({ page: p, pageSize: ps })
}

// 搜索参数 / 分页变更 → 自动请求
watch(
  [searchParams, page, pageSize],
  () => {
    fetch(searchParams.value as PageParams)
  },
  { immediate: true },
)
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px 0;
}

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.admin-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

/* 角色标签 */
.role-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 12px;
  color: #606266;
  background: #f0f2f5;
}

.role-tag.role-admin {
  color: #409eff;
  background: #ecf5ff;
}

/* 状态圆点 */
.status-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}

.status-dot.status-on {
  background: #67c23a;
}

.status-dot.status-off {
  background: #f56c6c;
}

/* H5 适配 */
@media (max-width: 768px) {
  .admin-container {
    padding: 0 12px;
  }
  .admin-page {
    padding: 12px 0;
  }
}

@media (max-width: 480px) {
  .admin-title {
    font-size: 18px;
  }
}
</style>
