<script setup lang="ts">
import { SwitchControl, SwitchRoot, SwitchThumb, type SwitchRootProps, type SwitchRootEmits } from '@ark-ui/vue'
import { cn } from '@/utils/cn'

interface Props extends SwitchRootProps {
  class?: string
}

const props = defineProps<Props>()
const emit = defineEmits<SwitchRootEmits>()
</script>

<template>
  <SwitchRoot
    :class="cn('peer inline-flex items-center', props.class)"
    v-bind="props"
    @update:checked="emit('update:checked', $event)"
    @checked-change="emit('checkedChange', $event)"
  >
    <SwitchControl
      :class="
        cn(
          'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
          'data-[state=checked]:bg-primary data-[state=unchecked]:bg-switch-background',
          'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )
      "
    >
      <SwitchThumb
        :class="
          cn(
            'pointer-events-none block size-4 rounded-full bg-white shadow ring-0 transition-transform',
            'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0',
          )
        "
      />
    </SwitchControl>
    <slot />
  </SwitchRoot>
</template>
