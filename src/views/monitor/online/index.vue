<template>
  <div class="space-y-4">
    <div class="bg-surface rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
      <input
        v-model="query.username"
        type="text"
        placeholder="用户名"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        @keyup.enter="handleSearch"
      />
      <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark" @click="handleSearch">
        查询
      </button>
      <button class="px-4 py-2 border border-border rounded-md hover:bg-background" @click="resetQuery">重置</button>
    </div>

    <DataTable
      v-model:current="query.pageNum"
      :data="list"
      :columns="columns"
      :loading="loading"
      :total="total"
      :size="query.pageSize"
    />
  </div>
</template>

<script setup lang="ts">
// keep-alive 按组件 name 缓存，组件 name 须与路由 name 一致（约定见 router/index.ts）
defineOptions({ name: 'Online' })
import { reactive, ref, watch } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { DataTable } from '@/components/ui/data-table'
import { usePermissionStore } from '@/store/permission'
import { fetchOnlinePage, kickOnlineUser, type OnlineUserItem } from '@/api/online'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<OnlineUserItem>()
const perm = usePermissionStore()

const columns = [
  columnHelper.accessor('username', { header: '用户名', size: 140 }),
  columnHelper.accessor('nickname', { header: '昵称', size: 140 }),
  columnHelper.accessor('loginIp', { header: '登录IP', size: 140 }),
  columnHelper.accessor('loginLocation', { header: '归属地', size: 160 }),
  columnHelper.accessor('loginTime', {
    header: '登录时间',
    size: 180,
    cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-',
  }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 120,
    cell: ({ row }) => {
      if (!perm.hasPerm('monitor:online:kick')) return null
      return h(
        'button',
        {
          class: 'text-sm text-red-500 hover:underline',
          onClick: () => kick(row.original.jti, row.original.username),
        },
        '强退',
      )
    },
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, username: '' })
const list = ref<OnlineUserItem[]>([])
const total = ref(0)
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res: PageRes<OnlineUserItem> = await fetchOnlinePage(query)
    list.value = res.records
    total.value = res.total
  } catch (e: any) {
    alert(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.pageNum = 1
  loadData()
}
const resetQuery = () => {
  query.username = ''
  query.pageNum = 1
  loadData()
}
const kick = async (jti: string, username: string) => {
  if (!confirm(`确认强制下线用户 ${username}？`)) return
  await kickOnlineUser(jti)
  loadData()
}

watch(() => query.pageNum, loadData, { immediate: true })
</script>
