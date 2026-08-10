<template>
  <div class="bg-surface rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">组织管理</h2>
      <button
        v-perm="'system:org:create'"
        class="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
        @click="openCreate(0)"
      >
        新增
      </button>
    </div>
    <div v-if="loading" class="py-8 text-center text-text-secondary">加载中...</div>
    <ul v-else-if="tree.length" class="space-y-1">
      <OrgTreeNode
        v-for="node in tree"
        :key="node.orgId"
        :node="node"
        @edit="openEdit"
        @add="openCreate"
        @remove="remove"
      />
    </ul>
    <div v-else class="py-8 text-center text-text-secondary">暂无数据</div>

    <AppModal v-model="modalVisible" :title="isEdit ? '编辑组织' : '新增组织'" :loading="saving" @submit="save">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">上级组织</label>
          <select
            v-model="form.parentId"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option :value="0">顶层</option>
            <option v-for="item in flatOrgs" :key="item.orgId" :value="item.orgId">{{ item.orgName }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">组织名称</label>
          <input
            v-model="form.orgName"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">组织编码</label>
          <input
            v-model="form.orgCode"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">排序</label>
          <input
            v-model.number="form.sort"
            type="number"
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
            <option value="1">停用</option>
          </select>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
// keep-alive 按组件 name 缓存，组件 name 须与路由 name 一致（约定见 router/index.ts）
defineOptions({ name: 'Org' })
import { ref, computed, onMounted } from 'vue'
import OrgTreeNode from './OrgTreeNode.vue'
import AppModal from '@/components/AppModal.vue'
import { fetchOrgTree, createOrg, updateOrg, deleteOrg, type OrgTreeItem } from '@/api/org'

const tree = ref<OrgTreeItem[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive<Partial<OrgTreeItem>>({
  orgId: undefined,
  parentId: 0,
  orgName: '',
  orgCode: '',
  sort: 0,
  status: '0',
})

const flatOrgs = computed(() => {
  const walk = (nodes: OrgTreeItem[], result: OrgTreeItem[]) => {
    nodes.forEach((n) => {
      result.push(n)
      if (n.children) walk(n.children, result)
    })
    return result
  }
  return walk(tree.value, [])
})

const resetForm = () =>
  Object.assign(form, {
    orgId: undefined,
    parentId: 0,
    orgName: '',
    orgCode: '',
    sort: 0,
    status: '0',
  })

const openCreate = (parentId: number) => {
  isEdit.value = false
  resetForm()
  form.parentId = parentId
  modalVisible.value = true
}

const openEdit = (row: OrgTreeItem) => {
  isEdit.value = true
  resetForm()
  Object.assign(form, row)
  modalVisible.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value && form.orgId) await updateOrg(form as any)
    else await createOrg(form)
    modalVisible.value = false
    loadData()
  } catch (e: any) {
    alert(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const remove = async (id: number) => {
  if (!confirm('确认删除该组织？')) return
  await deleteOrg(id)
  loadData()
}

const loadData = async () => {
  loading.value = true
  try {
    tree.value = await fetchOrgTree()
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
