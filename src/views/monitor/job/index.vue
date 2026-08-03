<template>
  <div class="space-y-4">
    <div class="bg-surface rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
      <input
        v-model="query.jobName"
        type="text"
        placeholder="任务名称"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        @keyup.enter="handleSearch"
      />
      <select
        v-model="query.status"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">全部状态</option>
        <option value="0">正常</option>
        <option value="1">暂停</option>
      </select>
      <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark" @click="handleSearch">查询</button>
      <button class="px-4 py-2 border border-border rounded-md hover:bg-background" @click="resetQuery">重置</button>
    </div>

    <DataTable
      :data="list"
      :columns="columns"
      :loading="loading"
      :total="total"
      v-model:current="query.pageNum"
      :size="query.pageSize"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import DataTable from '@/components/DataTable.vue'
import { fetchJobPage, deleteJob, type JobItem } from '@/api/job'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<JobItem>()

const columns = [
  columnHelper.accessor('jobName', { header: '任务名称', size: 160 }),
  columnHelper.accessor('beanName', { header: 'Bean', size: 160 }),
  columnHelper.accessor('methodName', { header: '方法', size: 120 }),
  columnHelper.accessor('cron', { header: 'Cron', size: 140 }),
  columnHelper.accessor('status', { header: '状态', size: 100, cell: (info) => (info.getValue() === '0' ? '正常' : '暂停') }),
  columnHelper.accessor('createdAt', { header: '创建时间', size: 180, cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-' }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 120,
    cell: ({ row }) => h('button', {
      class: 'text-sm text-red-500 hover:underline',
      onClick: () => remove(row.original.jobId),
    }, '删除'),
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, jobName: '', status: '' })
const list = ref<JobItem[]>([])
const total = ref(0)
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res: PageRes<JobItem> = await fetchJobPage(query)
    list.value = res.records
    total.value = res.total
  } catch (e: any) {
    alert(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { query.pageNum = 1; loadData() }
const resetQuery = () => { query.jobName = ''; query.status = ''; query.pageNum = 1; loadData() }
const remove = async (id: number) => { if (!confirm('确认删除？')) return; await deleteJob(id); loadData() }

watch(() => query.pageNum, loadData, { immediate: true })
</script>
