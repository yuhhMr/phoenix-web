<template>
  <div class="bg-surface rounded-xl p-4 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">菜单管理</h2>
      <button
        v-perm="'system:menu:create'"
        class="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
        @click="openCreate(0)"
      >
        新增
      </button>
    </div>
    <div v-if="loading" class="py-8 text-center text-text-secondary">加载中...</div>
    <ul v-else-if="tree.length" class="space-y-1">
      <MenuTreeNode
        v-for="node in tree"
        :key="node.menuId"
        :node="node"
        @edit="openEdit"
        @add="openCreate"
        @remove="remove"
      />
    </ul>
    <div v-else class="py-8 text-center text-text-secondary">暂无数据</div>

    <DialogModal v-model:open="modalVisible" :title="isEdit ? '编辑菜单' : '新增菜单'" :loading="saving" @submit="save">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">上级菜单</label>
          <select
            v-model="form.parentId"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option :value="0">顶层</option>
            <option v-for="item in flatMenus" :key="item.menuId" :value="item.menuId">{{ item.menuName }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">菜单名称</label>
          <input
            v-model="form.menuName"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">菜单类型</label>
          <select
            v-model="form.menuType"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="M">目录</option>
            <option value="C">菜单</option>
            <option value="F">按钮</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">路由路径</label>
          <input
            v-model="form.path"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">组件路径</label>
          <input
            v-model="form.component"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">权限标识</label>
          <input
            v-model="form.perms"
            type="text"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">图标</label>
          <input
            v-model="form.icon"
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
          <label class="block text-sm font-medium mb-1">显示状态</label>
          <select
            v-model="form.visible"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="0">隐藏</option>
            <option value="1">显示</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">菜单状态</label>
          <select
            v-model="form.status"
            class="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="0">正常</option>
            <option value="1">停用</option>
          </select>
        </div>
      </div>
    </DialogModal>
  </div>
</template>

<script setup lang="ts">
// keep-alive 按组件 name 缓存，组件 name 须与路由 name 一致（约定见 router/index.ts）
defineOptions({ name: 'SystemMenu' })
import { ref, computed, onMounted } from 'vue'
import MenuTreeNode from './MenuTreeNode.vue'
import { DialogModal } from '@/components/ui/dialog'
import { fetchMenuTree, createMenu, updateMenu, deleteMenu, type MenuTreeItem } from '@/api/menu'

const tree = ref<MenuTreeItem[]>([])
const loading = ref(false)
const modalVisible = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const form = reactive<Partial<MenuTreeItem> & { visible?: string }>({
  menuId: undefined,
  parentId: 0,
  menuName: '',
  menuType: 'C',
  path: '',
  component: '',
  perms: '',
  icon: '',
  sort: 0,
  visible: '1',
  status: '0',
})

const flatMenus = computed(() => {
  const walk = (nodes: MenuTreeItem[], result: MenuTreeItem[]) => {
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
    menuId: undefined,
    parentId: 0,
    menuName: '',
    menuType: 'C',
    path: '',
    component: '',
    perms: '',
    icon: '',
    sort: 0,
    visible: '1',
    status: '0',
  })

const openCreate = (parentId: number) => {
  isEdit.value = false
  resetForm()
  form.parentId = parentId
  modalVisible.value = true
}

const openEdit = (row: MenuTreeItem) => {
  isEdit.value = true
  resetForm()
  Object.assign(form, row)
  modalVisible.value = true
}

const save = async () => {
  saving.value = true
  try {
    if (isEdit.value && form.menuId) await updateMenu(form as any)
    else await createMenu(form)
    modalVisible.value = false
    loadData()
  } catch (e: any) {
    alert(e.message || '保存失败')
  } finally {
    saving.value = false
  }
}

const remove = async (id: number) => {
  if (!confirm('确认删除该菜单？')) return
  await deleteMenu(id)
  loadData()
}

const loadData = async () => {
  loading.value = true
  try {
    tree.value = await fetchMenuTree()
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>
