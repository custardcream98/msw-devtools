<template>
  <button
    type="button"
    :class="[
      'cursor-pointer rounded-xl bg-gray-600 px-3 py-1 text-sm',
      'transition-all duration-300',
      'hover:[:not(:disabled)]:bg-gray-900',
      'disabled:cursor-progress disabled:opacity-50',
      className
    ]"
    :disabled="!!isFetchingCount"
    @click="handleClick"
  >
    <slot>Reload</slot>
  </button>
</template>

<script setup lang="ts">
import { useIsFetching } from '@tanstack/vue-query'
import { computed } from 'vue'

const props = defineProps<{
  className?: string
}>()

const emit = defineEmits<{
  (event: 'click'): void
}>()

const isFetchingCount = useIsFetching()
const className = computed(() => props.className || '')

const handleClick = () => {
  emit('click')
}
</script>
