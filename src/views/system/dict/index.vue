<template>
  <div class="space-y-4">
    <div class="bg-surface rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
      <input
        v-model="query.dictName"
        type="text"
        placeholder="字典名称"
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
import { fetchDictTypePage, deleteDictType, type DictTypeItem } from '@/api/dict'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<DictTypeItem>()

const columns = [
  columnHelper.accessor('dictName', { header: '字典名称', size: 180 }),
  columnHelper.accessor('dictType', { header: '字典类型', size: 180 }),
  columnHelper.accessor('status', { header: '状态', size: 100, cell: (info) => (info.getValue() === '0' ? '正常' : '停用') }),
  columnHelper.accessor('createdAt', { header: '创建时间', size: 180, cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-' }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 120,
    cell: ({ row }) => h('button', {
      class: 'text-sm text-red-500 hover:underline',
      onClick: () => remove(row.original.dictTypeId),
    }, '删除'),
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, dictName: '', status: '' })
const list = ref<DictTypeItem[]>([])
const total = ref(0)
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res: PageRes<DictTypeItem> = await fetchDictTypePage(query)
    list.value = res.records
    total.value = res.total
  } catch (e: any) {
    alert(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { query.pageNum = 1; loadData() }
const resetQuery = () => { query.dictName = ''; query.status = ''; query.pageNum = 1; loadData() }
const remove = async (id: number) => { if (!confirm('确认删除？')) return; await deleteDictType(id); loadData() }

watch(() => query.pageNum, loadData, { immediate: true })
</script>
