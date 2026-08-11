<script setup lang="ts">
import { computed } from 'vue'
import { createListCollection, type ListCollection } from '@ark-ui/vue/collection'
import SelectRoot from './SelectRoot.vue'
import SelectTrigger from './SelectTrigger.vue'
import SelectValue from './SelectValue.vue'
import SelectContent from './SelectContent.vue'
import SelectItem from './SelectItem.vue'

export interface SelectOption {
  label: string
  value: string
}

interface Props {
  modelValue: string
  options: SelectOption[] | ListCollection<SelectOption>
  placeholder?: string
  disabled?: boolean
  triggerClass?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const collection = computed<ListCollection<SelectOption>>(() => {
  const opts = props.options
  if (Array.isArray(opts)) {
    return createListCollection({ items: opts })
  }
  return opts
})
</script>

<template>
  <SelectRoot
    :collection="collection"
    :model-value="[modelValue]"
    :disabled="disabled"
    @update:model-value="emit('update:modelValue', $event[0])"
  >
    <SelectTrigger :class="triggerClass">
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="item in collection.items" :key="item.value" :item="item">
        {{ item.label }}
      </SelectItem>
    </SelectContent>
  </SelectRoot>
</template>
