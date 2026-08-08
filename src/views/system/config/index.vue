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
      <button v-perm="'system:config:create'" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark ml-auto" @click="openCreate">新增</button>
    </div>

    <DataTable
      :data="list"
      :columns="columns"
      :loading="loading"
      :total="total"
      v-model:current="query.pageNum"
      :size="query.pageSize"
    />

    <AppModal v-model="modalVisible" :title="isEdit ? '编辑参数' : '新增参数'" :loading="saving" @submit="save">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">参数名称</label>
          <input v-model="form.configName" type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">参数键</label>
          <input v-model="form.configKey" type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">参数值</label>
          <input v-model="form.configValue" type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">值类型</label>
          <select v-model="form.valueType" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="STRING">STRING</option>
            <option value="INT">INT</option>
            <option value="BOOL">BOOL</option>
            <option value="JSON">JSON</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">备注</label>
          <textarea v-model="form.remark" rows="2" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import DataTable from '@/components/DataTable.vue'
import AppModal from '@/components/AppModal.vue'
import { fetchConfigPage, createConfig, updateConfig, deleteConfig, type ConfigItem } from '@/api/config'
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
    size: 160,
    cell: ({ row }) => h('div', { class: 'flex gap-3' }, [
      h('button', { class: 'text-sm text-primary hover:underline', onClick: () => openEdit(row.original) }, '编辑'),
      h('button', { class: 'text-sm text-red-500 hover:underline', onClick: () => remove(row.original.configId) }, '删除'),
    ]),
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, configName: '', configKey: '' })
const list = ref<ConfigItem[]>([])
const total = ref(0)
const loading = ref(false)

const modalVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive<Partial<ConfigItem>>({ configId: undefined, configName: '', configKey: '', configValue: '', valueType: 'STRING', remark: '' })

const resetForm = () => Object.assign(form, { configId: undefined, configName: '', configKey: '', configValue: '', valueType: 'STRING', remark: '' })
const openCreate = () => { isEdit.value = false; resetForm(); modalVisible.value = true }
const openEdit = (row: ConfigItem) => { isEdit.value = true; resetForm(); Object.assign(form, row); modalVisible.value = true }

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value && form.configId) await updateConfig(form as any)
    else await createConfig(form)
    modalVisible.value = false
    loadData()
  } catch (e: any) {
    alert(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

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
