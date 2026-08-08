<template>
  <div class="space-y-4">
    <div class="bg-surface rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
      <input
        v-model="query.roleName"
        type="text"
        placeholder="角色名称"
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
      <button v-perm="'system:role:create'" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark ml-auto" @click="openCreate">新增</button>
    </div>

    <DataTable
      :data="list"
      :columns="columns"
      :loading="loading"
      :total="total"
      v-model:current="query.pageNum"
      :size="query.pageSize"
    />

    <AppModal v-model="modalVisible" :title="isEdit ? '编辑角色' : '新增角色'" :loading="saving" @submit="save">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">角色名称</label>
          <input v-model="form.roleName" type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">角色编码</label>
          <input v-model="form.roleCode" type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">数据范围</label>
          <select v-model="form.dataScope" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option :value="1">全部</option>
            <option :value="2">自定义</option>
            <option :value="3">本部门</option>
            <option :value="4">本部门及以下</option>
            <option :value="5">仅本人</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">排序</label>
          <input v-model.number="form.sort" type="number" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">状态</label>
          <select v-model="form.status" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="0">正常</option>
            <option value="1">停用</option>
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
import { fetchRolePage, createRole, updateRole, deleteRole, type RoleItem } from '@/api/role'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<RoleItem>()

const dataScopeMap: Record<number, string> = {
  1: '全部', 2: '自定义', 3: '本部门', 4: '本部门及以下', 5: '仅本人',
}

const columns = [
  columnHelper.accessor('roleName', { header: '角色名称', size: 160 }),
  columnHelper.accessor('roleCode', { header: '角色编码', size: 160 }),
  columnHelper.accessor('dataScope', { header: '数据范围', size: 140, cell: (info) => dataScopeMap[info.getValue()] || info.getValue() }),
  columnHelper.accessor('status', { header: '状态', size: 100, cell: (info) => (info.getValue() === '0' ? '正常' : '停用') }),
  columnHelper.accessor('createdAt', { header: '创建时间', size: 180, cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-' }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 160,
    cell: ({ row }) => h('div', { class: 'flex gap-3' }, [
      h('button', { class: 'text-sm text-primary hover:underline', onClick: () => openEdit(row.original) }, '编辑'),
      h('button', { class: 'text-sm text-red-500 hover:underline', onClick: () => remove(row.original.roleId) }, '删除'),
    ]),
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, roleName: '', status: '' })
const list = ref<RoleItem[]>([])
const total = ref(0)
const loading = ref(false)

const modalVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive<Partial<RoleItem>>({ roleId: undefined, roleName: '', roleCode: '', dataScope: 1, sort: 0, status: '0', remark: '' })

const resetForm = () => {
  Object.assign(form, { roleId: undefined, roleName: '', roleCode: '', dataScope: 1, sort: 0, status: '0', remark: '' })
}

const openCreate = () => { isEdit.value = false; resetForm(); modalVisible.value = true }
const openEdit = (row: RoleItem) => { isEdit.value = true; resetForm(); Object.assign(form, row); modalVisible.value = true }

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value && form.roleId) {
      await updateRole(form as any)
    } else {
      await createRole(form)
    }
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
    const res: PageRes<RoleItem> = await fetchRolePage(query)
    list.value = res.records
    total.value = res.total
  } catch (e: any) {
    alert(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { query.pageNum = 1; loadData() }
const resetQuery = () => { query.roleName = ''; query.status = ''; query.pageNum = 1; loadData() }
const remove = async (id: number) => { if (!confirm('确认删除该角色？')) return; await deleteRole(id); loadData() }

watch(() => query.pageNum, loadData, { immediate: true })
</script>
