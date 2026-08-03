<template>
  <div class="space-y-4">
    <div class="bg-surface rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
      <input
        v-model="query.title"
        type="text"
        placeholder="标题"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        @keyup.enter="handleSearch"
      />
      <select
        v-model="query.noticeType"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">全部类型</option>
        <option value="NOTICE">通知</option>
        <option value="ANNOUNCE">公告</option>
      </select>
      <select
        v-model="query.publishStatus"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">全部状态</option>
        <option value="0">草稿</option>
        <option value="1">已发布</option>
        <option value="2">已下线</option>
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
import { fetchNoticePage, deleteNotice, type NoticeItem } from '@/api/notice'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<NoticeItem>()

const typeMap: Record<string, string> = { NOTICE: '通知', ANNOUNCE: '公告' }
const statusMap: Record<string, string> = { '0': '草稿', '1': '已发布', '2': '已下线' }
const priorityMap: Record<number, string> = { 0: '普通', 1: '重要', 2: '紧急' }

const columns = [
  columnHelper.accessor('title', { header: '标题', size: 240 }),
  columnHelper.accessor('noticeType', { header: '类型', size: 100, cell: (info) => typeMap[info.getValue()] || info.getValue() }),
  columnHelper.accessor('priority', { header: '优先级', size: 100, cell: (info) => priorityMap[info.getValue()] || info.getValue() }),
  columnHelper.accessor('publishStatus', { header: '状态', size: 100, cell: (info) => statusMap[info.getValue()] || info.getValue() }),
  columnHelper.accessor('createdAt', { header: '创建时间', size: 170, cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-' }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 120,
    cell: ({ row }) => h('button', {
      class: 'text-sm text-red-500 hover:underline',
      onClick: () => remove(row.original.noticeId),
    }, '删除'),
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, title: '', noticeType: '', publishStatus: '' })
const list = ref<NoticeItem[]>([])
const total = ref(0)
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res: PageRes<NoticeItem> = await fetchNoticePage(query)
    list.value = res.records
    total.value = res.total
  } catch (e: any) {
    alert(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { query.pageNum = 1; loadData() }
const resetQuery = () => { query.title = ''; query.noticeType = ''; query.publishStatus = ''; query.pageNum = 1; loadData() }
const remove = async (id: number) => { if (!confirm('确认删除？')) return; await deleteNotice(id); loadData() }

watch(() => query.pageNum, loadData, { immediate: true })
</script>
