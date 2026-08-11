<script setup lang="ts">
import { CheckboxControl, CheckboxIndicator, CheckboxRoot, type CheckboxRootProps, type CheckboxRootEmits } from '@ark-ui/vue'
import { cn } from '@/utils/cn'
import IconCheck from '~icons/lucide/check'

interface Props extends CheckboxRootProps {
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits<CheckboxRootEmits>()
</script>

<template>
  <CheckboxRoot
    :class="cn('peer flex items-center gap-2', props.class)"
    v-bind="props"
    @update:checked="emit('update:checked', $event)"
    @checked-change="emit('checkedChange', $event)"
  >
    <CheckboxControl
      :class="
        cn(
          'size-4 shrink-0 rounded-[4px] border border-input bg-input-background shadow-sm transition-colors',
          'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
          'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )
      "
    >
      <CheckboxIndicator>
        <IconCheck class="size-3.5" />
      </CheckboxIndicator>
    </CheckboxControl>
    <slot />
  </CheckboxRoot>
</template>
