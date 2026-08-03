<template>
  <div class="space-y-4">
    <div class="bg-surface rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
      <input
        v-model="query.configName"
        type="text"
        placeholder="参数名称"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        @keyup.enter="handleSearch"
      />
      <input
        v-model="query.configKey"
        type="text"
        placeholder="参数键"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        @keyup.enter="handleSearch"
      />
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
import { fetchConfigPage, deleteConfig, type ConfigItem } from '@/api/config'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<ConfigItem>()

const columns = [
  columnHelper.accessor('configName', { header: '参数名称', size: 180 }),
  columnHelper.accessor('configKey', { header: '参数键', size: 200 }),
  columnHelper.accessor('configValue', { header: '参数值', size: 200 }),
  columnHelper.accessor('valueType', { header: '值类型', size: 100 }),
  columnHelper.accessor('createdAt', { header: '创建时间', size: 180, cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-' }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 120,
    cell: ({ row }) => h('button', {
      class: 'text-sm text-red-500 hover:underline',
      onClick: () => remove(row.original.configId),
    }, '删除'),
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, configName: '', configKey: '' })
const list = ref<ConfigItem[]>([])
const total = ref(0)
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  try {
    const res: PageRes<ConfigItem> = await fetchConfigPage(query)
    list.value = res.records
    total.value = res.total
  } catch (e: any) {
    alert(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { query.pageNum = 1; loadData() }
const resetQuery = () => { query.configName = ''; query.configKey = ''; query.pageNum = 1; loadData() }
const remove = async (id: number) => { if (!confirm('确认删除？')) return; await deleteConfig(id); loadData() }

watch(() => query.pageNum, loadData, { immediate: true })
</script>
