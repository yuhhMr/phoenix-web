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
      <button v-perm="'system:dict:create'" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark ml-auto" @click="openCreate">新增</button>
    </div>

    <DataTable
      :data="list"
      :columns="columns"
      :loading="loading"
      :total="total"
      v-model:current="query.pageNum"
      :size="query.pageSize"
    />

    <AppModal v-model="modalVisible" :title="isEdit ? '编辑字典' : '新增字典'" :loading="saving" @submit="save">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">字典名称</label>
          <input v-model="form.dictName" type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">字典类型</label>
          <input v-model="form.dictType" type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">状态</label>
          <select v-model="form.status" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="0">正常</option>
            <option value="1">停用</option>
          </select>
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
import { usePermissionStore } from '@/store/permission'
import { fetchDictTypePage, createDictType, updateDictType, deleteDictType, type DictTypeItem } from '@/api/dict'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<DictTypeItem>()
const perm = usePermissionStore()

const columns = [
  columnHelper.accessor('dictName', { header: '字典名称', size: 180 }),
  columnHelper.accessor('dictType', { header: '字典类型', size: 180 }),
  columnHelper.accessor('status', { header: '状态', size: 100, cell: (info) => (info.getValue() === '0' ? '正常' : '停用') }),
  columnHelper.accessor('createdAt', { header: '创建时间', size: 180, cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-' }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 160,
    cell: ({ row }) => {
      const btns = []
      if (perm.hasPerm('system:dict:update')) {
        btns.push(h('button', { class: 'text-sm text-primary hover:underline', onClick: () => openEdit(row.original) }, '编辑'))
      }
      if (perm.hasPerm('system:dict:delete')) {
        btns.push(h('button', { class: 'text-sm text-red-500 hover:underline', onClick: () => remove(row.original.dictTypeId) }, '删除'))
      }
      return h('div', { class: 'flex gap-3' }, btns)
    },
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, dictName: '', status: '' })
const list = ref<DictTypeItem[]>([])
const total = ref(0)
const loading = ref(false)

const modalVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive<Partial<DictTypeItem>>({ dictTypeId: undefined, dictName: '', dictType: '', status: '0' })

const resetForm = () => Object.assign(form, { dictTypeId: undefined, dictName: '', dictType: '', status: '0' })
const openCreate = () => { isEdit.value = false; resetForm(); modalVisible.value = true }
const openEdit = (row: DictTypeItem) => { isEdit.value = true; resetForm(); Object.assign(form, row); modalVisible.value = true }

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value && form.dictTypeId) await updateDictType(form as any)
    else await createDictType(form)
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
