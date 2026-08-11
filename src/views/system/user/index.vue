<template>
  <div class="space-y-4">
    <!-- 查询表单 -->
    <div class="bg-surface rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4">
      <input
        v-model="query.username"
        type="text"
        placeholder="用户名"
        class="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        @keyup.enter="handleSearch"
      />
      <input
        v-model="query.nickname"
        type="text"
        placeholder="昵称"
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
      <button class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark" @click="handleSearch">
        查询
      </button>
      <button class="px-4 py-2 border border-border rounded-md hover:bg-background" @click="resetQuery">重置</button>
      <button
        v-perm="'system:user:create'"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark ml-auto"
        @click="openCreate"
      >
        新增
      </button>
    </div>

    <!-- 表格 -->
    <DataTable
      v-model:current="query.current"
      :data="list"
      :columns="columns"
      :loading="loading"
      :total="total"
      :size="query.size"
    />

    <!-- 新增/编辑 -->
    <DialogModal v-model:open="modalVisible" :title="isEdit ? '编辑用户' : '新增用户'" :loading="saving" @submit="save">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">用户名</label>
          <input
            v-model="form.username"
            :disabled="isEdit"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div v-if="!isEdit">
          <label class="block text-sm font-medium mb-1">初始密码</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">昵称</label>
          <input
            v-model="form.nickname"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">邮箱</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">手机号</label>
          <input
            v-model="form.phone"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">状态</label>
          <select
            v-model="form.status"
            :disabled="isEdit"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="0">正常</option>
            <option value="1">停用</option>
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
defineOptions({ name: 'User' })
import { reactive, ref, watch } from 'vue'
import { createColumnHelper } from '@tanstack/vue-table'
import { DataTable } from '@/components/ui/table'
import { DialogModal } from '@/components/ui/dialog'
import { usePermissionStore } from '@/store/permission'
import { fetchUserPage, createUser, updateUser, deleteUser, updateUserStatus, type UserItem } from '@/api/user'
import type { PageRes } from '@/types/api'

const columnHelper = createColumnHelper<UserItem>()
const perm = usePermissionStore()

const columns = [
  columnHelper.accessor('username', { header: '用户名', size: 160 }),
  columnHelper.accessor('nickname', { header: '昵称', size: 160 }),
  columnHelper.accessor('email', { header: '邮箱', size: 200 }),
  columnHelper.accessor('phone', { header: '手机号', size: 140 }),
  columnHelper.accessor('status', {
    header: '状态',
    size: 100,
    cell: (info) => (info.getValue() === '0' ? '正常' : '停用'),
  }),
  columnHelper.accessor('createdAt', {
    header: '创建时间',
    size: 180,
    cell: (info) => info.getValue()?.slice(0, 19).replace('T', ' ') || '-',
  }),
  columnHelper.display({
    id: 'actions',
    header: '操作',
    size: 200,
    cell: ({ row }) => {
      const btns = []
      if (perm.hasPerm('system:user:update')) {
        btns.push(
          h('button', { class: 'text-sm text-primary hover:underline', onClick: () => openEdit(row.original) }, '编辑'),
        )
      }
      if (perm.hasPerm('system:user:update')) {
        btns.push(
          h(
            'button',
            { class: 'text-sm text-primary hover:underline', onClick: () => toggleStatus(row.original) },
            row.original.status === '0' ? '停用' : '启用',
          ),
        )
      }
      if (perm.hasPerm('system:user:delete')) {
        btns.push(
          h(
            'button',
            { class: 'text-sm text-red-500 hover:underline', onClick: () => remove(row.original.userId) },
            '删除',
          ),
        )
      }
      return h('div', { class: 'flex gap-3' }, btns)
    },
  }),
]

const query = reactive({
  current: 1,
  size: 10,
  username: '',
  nickname: '',
  status: '',
})

const list = ref<UserItem[]>([])
const total = ref(0)
const loading = ref(false)

const modalVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive<Partial<UserItem> & { password: string }>({
  userId: undefined,
  username: '',
  password: '',
  nickname: '',
  email: '',
  phone: '',
  status: '0',
  remark: '',
})

const resetForm = () => {
  form.userId = undefined
  form.username = ''
  form.password = ''
  form.nickname = ''
  form.email = ''
  form.phone = ''
  form.status = '0'
  form.remark = ''
}

const openCreate = () => {
  isEdit.value = false
  resetForm()
  modalVisible.value = true
}

const openEdit = (row: UserItem) => {
  isEdit.value = true
  resetForm()
  Object.assign(form, row)
  modalVisible.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value && form.userId) {
      await updateUser({
        userId: form.userId,
        nickname: form.nickname,
        email: form.email,
        phone: form.phone,
        remark: form.remark,
      })
    } else {
      await createUser({
        username: form.username,
        password: form.password,
        nickname: form.nickname,
        email: form.email,
        phone: form.phone,
        status: form.status,
        remark: form.remark,
      })
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
    const res: PageRes<UserItem> = await fetchUserPage(query)
    list.value = res.records
    total.value = res.total
  } catch (e: any) {
    alert(e.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.current = 1
  loadData()
}

const resetQuery = () => {
  query.username = ''
  query.nickname = ''
  query.status = ''
  query.current = 1
  loadData()
}

const toggleStatus = async (row: UserItem) => {
  const next = row.status === '0' ? '1' : '0'
  if (!confirm(`确认${next === '0' ? '启用' : '停用'}用户 ${row.username}？`)) return
  await updateUserStatus(row.userId, next)
  loadData()
}

const remove = async (id: number) => {
  if (!confirm('确认删除该用户？')) return
  await deleteUser(id)
  loadData()
}

watch(() => query.current, loadData, { immediate: true })
</script>
