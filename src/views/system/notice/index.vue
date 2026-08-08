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
      <button v-perm="'system:notice:create'" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark ml-auto" @click="openCreate">新增</button>
    </div>

    <DataTable
      :data="list"
      :columns="columns"
      :loading="loading"
      :total="total"
      v-model:current="query.pageNum"
      :size="query.pageSize"
    />

    <AppModal v-model="modalVisible" :title="isEdit ? '编辑消息' : '新增消息'" :loading="saving" @submit="save">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">标题</label>
          <input v-model="form.title" type="text" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">类型</label>
          <select v-model="form.noticeType" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="NOTICE">通知</option>
            <option value="ANNOUNCE">公告</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">内容</label>
          <textarea v-model="form.content" rows="3" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">优先级</label>
          <select v-model.number="form.priority" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option :value="0">普通</option>
            <option :value="1">重要</option>
            <option :value="2">紧急</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">发布范围</label>
          <select v-model="form.publishScope" class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="ALL">全部</option>
            <option value="ORG">指定组织</option>
            <option value="USER">指定用户</option>
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
import { usePermissionStore } from '@/store/permission'
import { fetchNoticePage, createNotice, updateNotice, deleteNotice, publishNotice, offlineNotice, type NoticeItem } from '@/api/notice'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<NoticeItem>()
const perm = usePermissionStore()

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
    size: 200,
    cell: ({ row }) => {
      const btns = []
      if (perm.hasPerm('system:notice:update') && row.original.publishStatus !== '1') {
        btns.push(h('button', { class: 'text-sm text-primary hover:underline', onClick: () => openEdit(row.original) }, '编辑'))
      }
      if (perm.hasPerm('system:notice:publish')) {
        if (row.original.publishStatus !== '1') {
          btns.push(h('button', { class: 'text-sm text-green-600 hover:underline', onClick: () => publish(row.original.noticeId) }, '发布'))
        } else {
          btns.push(h('button', { class: 'text-sm text-orange-500 hover:underline', onClick: () => offline(row.original.noticeId) }, '下线'))
        }
      }
      if (perm.hasPerm('system:notice:delete')) {
        btns.push(h('button', { class: 'text-sm text-red-500 hover:underline', onClick: () => remove(row.original.noticeId) }, '删除'))
      }
      return h('div', { class: 'flex gap-3' }, btns)
    },
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, title: '', noticeType: '', publishStatus: '' })
const list = ref<NoticeItem[]>([])
const total = ref(0)
const loading = ref(false)

const modalVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive<Partial<NoticeItem>>({
  noticeId: undefined,
  title: '',
  noticeType: 'NOTICE',
  content: '',
  priority: 0,
  publishScope: 'ALL',
  publishTarget: undefined,
  remark: '',
})

const resetForm = () => Object.assign(form, {
  noticeId: undefined,
  title: '',
  noticeType: 'NOTICE',
  content: '',
  priority: 0,
  publishScope: 'ALL',
  publishTarget: undefined,
  remark: '',
})
const openCreate = () => { isEdit.value = false; resetForm(); modalVisible.value = true }
const openEdit = (row: NoticeItem) => { isEdit.value = true; resetForm(); Object.assign(form, row); modalVisible.value = true }

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value && form.noticeId) await updateNotice(form as any)
    else await createNotice(form)
    modalVisible.value = false
    loadData()
  } catch (e: any) {
    alert(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const publish = async (id: number) => {
  if (!confirm('确认发布该消息？')) return
  await publishNotice(id)
  loadData()
}

const offline = async (id: number) => {
  if (!confirm('确认下线该消息？')) return
  await offlineNotice(id)
  loadData()
}

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
