<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'

const props = defineProps<{
  targetUrl: string
}>()

const { data, suspense } = useQuery({
  queryKey: [props.targetUrl],
  queryFn: async () => {
    const response = await fetch(props.targetUrl)
    return await response.json()
  }
})

await suspense()

const queryClient = useQueryClient()

const handleClick = async () => {
  queryClient.resetQueries({
    queryKey: [props.targetUrl]
  })
}
</script>

<style module>
.wrapper {
  width: 33%;
  padding: 1rem;
}
.targetUrl {
  display: 'block';
  font-family: 'Courier New', Courier, 'Lucida Console', 'Lucida Sans Typewriter',
    'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Andale Mono', 'Nimbus Mono L', Monaco, Consolas,
    'Liberation Mono', 'Courier New', monospace;
  word-break: break-all;
}
.button {
  margin-top: 1rem;
}
.response {
  margin-top: 1rem;
}
.pre {
  overflow: auto;
}
</style>

<template>
  <div :class="$style.wrapper">
    <div>
      <div>URL:</div>
      <div :class="$style.targetUrl">{{ targetUrl }}</div>
    </div>
    <button :class="$style.button" type="button" @click="handleClick">REFETCH</button>
    <div :class="$style.response">Response:</div>
    <pre :class="$style.pre">{{ JSON.stringify(data, null, 2) }}</pre>
  </div>
</template>
