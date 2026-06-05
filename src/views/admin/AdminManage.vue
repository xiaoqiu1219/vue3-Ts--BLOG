<template>
  <div class="admin-page">
    <div class="admin-container">
      <!-- 页面标题 -->
      <h2 class="admin-title">后台管理</h2>

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
          placeholder="请输入用户名/邮箱/部门"
          style="width: 240px"
          @keyup.enter="handleSearch"
        />

        <!-- 虚拟下拉搜索（角色） -->
        <VirtualDropdown
          v-model="formData.role"
          :options="roleOptions"
          placeholder="选择角色"
          style="width: 160px"
        />

        <!-- 虚拟下拉搜索（状态） -->
        <VirtualDropdown
          v-model="formData.status"
          :options="statusOptions"
          placeholder="选择状态"
          style="width: 120px"
        />

        <!-- 日期范围 -->
        <input v-model="formData.dateStart" type="date" title="起始日期" />
        <span style="color: #909399; line-height: 36px">—</span>
        <input v-model="formData.dateEnd" type="date" title="结束日期" />
      </SearchForm>

      <!-- 表格区 -->
      <VirtualTable
        :data="tableData"
        :columns="tableColumns"
        :loading="loading"
        :row-height="48"
        :max-height="500"
      >
        <!-- 表头插槽 -->
        <template #table-header>
          <th style="width: 80px">ID</th>
          <th style="width: 140px">用户名</th>
          <th style="width: 200px">邮箱</th>
          <th style="width: 100px">角色</th>
          <th style="width: 80px">状态</th>
          <th style="width: 120px">部门</th>
          <th style="width: 100px">城市</th>
          <th style="width: 140px">创建日期</th>
        </template>

        <!-- 行渲染插槽 -->
        <template #table-row="{ row }">
          <td style="width: 80px">{{ (row as UserRow).id }}</td>
          <td style="width: 140px">{{ (row as UserRow).name }}</td>
          <td style="width: 200px">{{ (row as UserRow).email }}</td>
          <td style="width: 100px">
            <span
              class="role-tag"
              :class="{ 'role-admin': (row as UserRow).role === '管理员' }"
            >
              {{ (row as UserRow).role }}
            </span>
          </td>
          <td style="width: 80px">
            <span
              class="status-dot"
              :class="(row as UserRow).status === '启用' ? 'status-on' : 'status-off'"
            ></span>
            {{ (row as UserRow).status }}
          </td>
          <td style="width: 120px">{{ (row as UserRow).department }}</td>
          <td style="width: 100px">{{ (row as UserRow).city }}</td>
          <td style="width: 140px">{{ (row as UserRow).createdAt }}</td>
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
import { watch } from 'vue'
import { useSearch } from '@/composables/useSearch'
import { useTable } from '@/composables/useTable'
import SearchForm from '@/components/admin/SearchForm.vue'
import VirtualDropdown from '@/components/admin/VirtualDropdown.vue'
import VirtualTable from '@/components/admin/VirtualTable.vue'
import Pagination from '@/components/admin/Pagination.vue'
import { mockFetchUsers, fetchUsers } from '@/api/admin'
import type { PageResult, PageParams } from '@/composables/useTable'

// ===== 行数据类型 =====
interface UserRow {
  id: number
  name: string
  email: string
  role: string
  status: string
  department: string
  city: string
  createdAt: string
}

// ===== 表格列定义 =====
const tableColumns = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: '用户名', width: '140px' },
  { key: 'email', label: '邮箱', width: '200px' },
  { key: 'role', label: '角色', width: '100px' },
  { key: 'status', label: '状态', width: '80px' },
  { key: 'department', label: '部门', width: '120px' },
  { key: 'city', label: '城市', width: '100px' },
  { key: 'createdAt', label: '创建日期', width: '140px' },
]

// ===== 下拉选项数据 =====
const roleOptions = [
  { label: '管理员', value: '管理员' },
  { label: '编辑', value: '编辑' },
  { label: '普通用户', value: '普通用户' },
  { label: '访客', value: '访客' },
]

const statusOptions = [
  { label: '启用', value: '启用' },
  { label: '禁用', value: '禁用' },
]

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
} = useTable<UserRow>(resolvedFetcher as (params: PageParams) => Promise<PageResult<UserRow>>)

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
