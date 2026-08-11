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
      <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark" @click="handleSearch">
        查询
      </button>
      <button class="px-4 py-2 border border-border rounded-md hover:bg-background" @click="resetQuery">重置</button>
      <button
        v-perm="'monitor:job:create'"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark ml-auto"
        @click="openCreate"
      >
        新增
      </button>
    </div>

    <DataTable
      v-model:current="query.pageNum"
      :data="list"
      :columns="columns"
      :loading="loading"
      :total="total"
      :size="query.pageSize"
    />

    <DialogModal v-model:open="modalVisible" :title="isEdit ? '编辑任务' : '新增任务'" :loading="saving" @submit="save">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">任务名称</label>
          <input
            v-model="form.jobName"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Bean 名称</label>
          <input
            v-model="form.beanName"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">方法名</label>
          <input
            v-model="form.methodName"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">参数</label>
          <input
            v-model="form.params"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Cron 表达式</label>
          <input
            v-model="form.cron"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">状态</label>
          <select
            v-model="form.status"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="0">正常</option>
            <option value="1">暂停</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">备注</label>
          <textarea
            v-model="form.remark"
            rows="2"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
      </div>
    </DialogModal>
  </div>
</template>

<script setup lang="ts">
// keep-alive 按组件 name 缓存，组件 name 须与路由 name 一致（约定见 router/index.ts）
defineOptions({ name: 'Job' })
import { reactive, ref, watch } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { DataTable } from '@/components/ui/table'
import { DialogModal } from '@/components/ui/dialog'
import { usePermissionStore } from '@/store/permission'
import { fetchJobPage, createJob, updateJob, deleteJob, changeJobStatus, runJobOnce, type JobItem } from '@/api/job'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<JobItem>()
const perm = usePermissionStore()

const columns = [
  columnHelper.accessor('jobName', { header: '任务名称', size: 160 }),
  columnHelper.accessor('beanName', { header: 'Bean', size: 160 }),
  columnHelper.accessor('methodName', { header: '方法', size: 120 }),
  columnHelper.accessor('cron', { header: 'Cron', size: 140 }),
  columnHelper.accessor('status', {
    header: '状态',
    size: 100,
    cell: (info) => (info.getValue() === '0' ? '正常' : '暂停'),
  }),
  columnHelper.accessor('createdAt', {
    header: '创建时间',
    size: 180,
    cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-',
  }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 240,
    cell: ({ row }) => {
      const btns = []
      if (perm.hasPerm('monitor:job:update')) {
        btns.push(
          h('button', { class: 'text-sm text-primary hover:underline', onClick: () => openEdit(row.original) }, '编辑'),
        )
        btns.push(
          h(
            'button',
            { class: 'text-sm text-primary hover:underline', onClick: () => toggleStatus(row.original) },
            row.original.status === '0' ? '暂停' : '启用',
          ),
        )
      }
      if (perm.hasPerm('monitor:job:run')) {
        btns.push(
          h(
            'button',
            { class: 'text-sm text-green-600 hover:underline', onClick: () => runOnce(row.original.jobId) },
            '执行',
          ),
        )
      }
      if (perm.hasPerm('monitor:job:delete')) {
        btns.push(
          h(
            'button',
            { class: 'text-sm text-red-500 hover:underline', onClick: () => remove(row.original.jobId) },
            '删除',
          ),
        )
      }
      return h('div', { class: 'flex gap-3' }, btns)
    },
  }),
]

const query = reactive({ pageNum: 1, pageSize: 10, jobName: '', status: '' })
const list = ref<JobItem[]>([])
const total = ref(0)
const loading = ref(false)

const modalVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive<Partial<JobItem>>({
  jobId: undefined,
  jobName: '',
  beanName: '',
  methodName: '',
  params: '',
  cron: '',
  status: '0',
  remark: '',
})

const resetForm = () =>
  Object.assign(form, {
    jobId: undefined,
    jobName: '',
    beanName: '',
    methodName: '',
    params: '',
    cron: '',
    status: '0',
    remark: '',
  })
const openCreate = () => {
  isEdit.value = false
  resetForm()
  modalVisible.value = true
}
const openEdit = (row: JobItem) => {
  isEdit.value = true
  resetForm()
  Object.assign(form, row)
  modalVisible.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value && form.jobId) await updateJob(form as any)
    else await createJob(form)
    modalVisible.value = false
    loadData()
  } catch (e: any) {
    alert(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const toggleStatus = async (row: JobItem) => {
  const next = row.status === '0' ? '1' : '0'
  if (!confirm(`确认${next === '0' ? '启用' : '暂停'}任务 ${row.jobName}？`)) return
  await changeJobStatus(row.jobId, next)
  loadData()
}

const runOnce = async (id: number) => {
  if (!confirm('确认立即执行一次？')) return
  await runJobOnce(id)
  loadData()
}

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

const handleSearch = () => {
  query.pageNum = 1
  loadData()
}
const resetQuery = () => {
  query.jobName = ''
  query.status = ''
  query.pageNum = 1
  loadData()
}
const remove = async (id: number) => {
  if (!confirm('确认删除？')) return
  await deleteJob(id)
  loadData()
}

watch(() => query.pageNum, loadData, { immediate: true })
</script>
