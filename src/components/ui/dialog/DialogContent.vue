<script setup lang="ts">
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPositioner,
  type DialogContentProps,
} from '@ark-ui/vue'
import { cn } from '@/utils/cn'
import IconClose from '~icons/lucide/x'

interface Props extends DialogContentProps {
  class?: string
  showClose?: boolean
}

withDefaults(defineProps<Props>(), {
  class: '',
  showClose: true,
})
</script>

<template>
  <DialogPositioner>
    <DialogBackdrop class="fixed inset-0 z-50 bg-black/50" />
    <DialogContent
      :class="
        cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-background p-6 shadow-lg duration-200 sm:max-w-lg',
          $props.class,
        )
      "
      v-bind="$props"
    >
      <slot />

      <DialogCloseTrigger
        v-if="showClose"
        :class="
          cn(
            'absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
            '[&_svg]:size-4 [&_svg]:shrink-0',
          )
        "
      >
        <IconClose />
        <span class="sr-only">Close</span>
      </DialogCloseTrigger>
    </DialogContent>
  </DialogPositioner>
</template>
