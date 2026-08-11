<template>
  <div class="space-y-4">
    <div class="bg-surface rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
      <select
        v-model="query.logType"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">全部类型</option>
        <option value="OPERATION">操作日志</option>
        <option value="LOGIN">登录日志</option>
      </select>
      <input
        v-model="query.username"
        type="text"
        placeholder="用户名"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        @keyup.enter="handleSearch"
      />
      <select
        v-model="query.status"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">全部状态</option>
        <option value="0">成功</option>
        <option value="1">失败</option>
      </select>
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
defineOptions({ name: 'Log' })
import { reactive, ref, watch } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { DataTable } from '@/components/ui/table'
import { fetchLogPage, type LogItem } from '@/api/log'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<LogItem>()

const columns = [
  columnHelper.accessor('logType', { header: '类型', size: 100 }),
  columnHelper.accessor('username', { header: '用户', size: 120 }),
  columnHelper.accessor('module', { header: '模块', size: 120 }),
  columnHelper.accessor('requestMethod', { header: '方法', size: 80 }),
  columnHelper.accessor('requestUrl', { header: 'URL', size: 200 }),
  columnHelper.accessor('ip', { header: 'IP', size: 130 }),
  columnHelper.accessor('status', {
    header: '状态',
    size: 80,
    cell: (info) => (info.getValue() === '0' ? '成功' : '失败'),
  }),
  columnHelper.accessor('costMs', { header: '耗时(ms)', size: 100 }),
  columnHelper.accessor('createdAt', {
    header: '时间',
    size: 170,
    cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-',
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, logType: '', username: '', status: '', startTime: '', endTime: '' })
const list = ref<LogItem[]>([])
const total = ref(0)
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res: PageRes<LogItem> = await fetchLogPage(query)
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
  query.logType = ''
  query.username = ''
  query.status = ''
  query.pageNum = 1
  loadData()
}

watch(() => query.pageNum, loadData, { immediate: true })
</script>
