<template>
  <div class="space-y-4">
    <!-- 查询表单 -->
    <div class="bg-surface rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
      <input
        v-model="query.username"
        type="text"
        placeholder="用户名"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        @keyup.enter="handleSearch"
      />
      <input
        v-model="query.nickname"
        type="text"
        placeholder="昵称"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        @keyup.enter="handleSearch"
      />
      <select
        v-model="query.status"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">全部状态</option>
        <option value="0">正常</option>
        <option value="1">停用</option>
      </select>
      <button
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        @click="handleSearch"
      >
        查询
      </button>
      <button
        class="px-4 py-2 border border-border rounded-md hover:bg-background"
        @click="resetQuery"
      >
        重置
      </button>
    </div>

    <!-- 表格 -->
    <DataTable
      :data="list"
      :columns="columns"
      :loading="loading"
      :total="total"
      v-model:current="query.current"
      :size="query.size"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import DataTable from '@/components/DataTable.vue'
import { fetchUserPage, deleteUser, updateUserStatus, type UserItem } from '@/api/user'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<UserItem>()

const columns = [
  columnHelper.accessor('username', { header: '用户名', size: 160 }),
  columnHelper.accessor('nickname', { header: '昵称', size: 160 }),
  columnHelper.accessor('email', { header: '邮箱', size: 200 }),
  columnHelper.accessor('phone', { header: '手机号', size: 140 }),
  columnHelper.accessor('status', {
    header: '状态',
    size: 100,
    cell: (info) => (info.getValue() === '0' ? '正常' : '停用'),
  }),
  columnHelper.accessor('createdAt', {
    header: '创建时间',
    size: 180,
    cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-',
  }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 160,
    cell: ({ row }) =>
      h('div', { class: 'flex gap-2' }, [
        h(
          'button',
          {
            class: 'text-sm text-primary hover:underline',
            onClick: () => toggleStatus(row.original),
          },
          row.original.status === '0' ? '停用' : '启用',
        ),
        h(
          'button',
          {
            class: 'text-sm text-red-500 hover:underline',
            onClick: () => remove(row.original.userId),
          },
          '删除',
        ),
      ]),
  }),
]

const query = reactive({
  current: 1,
  size: 10,
  username: '',
  nickname: '',
  status: '',
})

const list = ref<UserItem[]>([])
const total = ref(0)
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res: PageRes<UserItem> = await fetchUserPage(query)
    list.value = res.records
    total.value = res.total
  } catch (e: any) {
    alert(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.current = 1
  loadData()
}

const resetQuery = () => {
  query.username = ''
  query.nickname = ''
  query.status = ''
  query.current = 1
  loadData()
}

const toggleStatus = async (row: UserItem) => {
  const next = row.status === '0' ? '1' : '0'
  if (!confirm(`确认${next === '0' ? '启用' : '停用'}用户 ${row.username}？`)) return
  await updateUserStatus(row.userId, next)
  loadData()
}

const remove = async (id: number) => {
  if (!confirm('确认删除该用户？')) return
  await deleteUser(id)
  loadData()
}

watch(() => query.current, loadData, { immediate: true })
</script>
