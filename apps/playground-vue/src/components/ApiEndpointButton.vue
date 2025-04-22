<template>
  <button
    class="text-sm md:text-base flex cursor-pointer items-center gap-x-2 rounded-xl bg-gray-800 px-3 py-2 font-mono transition-all duration-300 hover:bg-gray-900"
    type="button"
    @click="handleClick"
  >
    {{ ENDPOINT }}
    <ClipboardCheckSVG v-if="copied" class="ml-2 h-4 w-4 text-green-500" />
    <ClipboardSVG v-else class="ml-2 h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ClipboardSVG from '@/assets/ClipboardSVG.vue'
import ClipboardCheckSVG from '@/assets/ClipboardCheckSVG.vue'
import { ENDPOINT } from '@/constants'

const copied = ref(false)

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
}

const handleClick = async () => {
  await copyToClipboard(ENDPOINT)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>
