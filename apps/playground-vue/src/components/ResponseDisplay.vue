<template>
  <div class="w-full max-w-4xl">
    <h2 class="flex items-center rounded-t-lg bg-gray-700 px-2 py-1 font-mono font-bold">
      Response
      <span :class="['ml-2', statusColor]">{{ responseData.status }}</span>
      <ReloadButton class="ml-auto" @click="refetch"> Reload </ReloadButton>
    </h2>
    <div class="overflow-hidden rounded-b-lg">
      <JsonHighlighter :code="isFetching ? 'Loading...' : jsonData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import ReloadButton from './ReloadButton.vue'
import JsonHighlighter from './JsonHighlighter.vue'
import { fetchCustardStatus } from '@/queryOptions'

const { data, isFetching, refetch } = useQuery({
  queryKey: ['custardStatus'],
  queryFn: fetchCustardStatus
})

const responseData = computed(() => data.value || { status: 200, response: 'Loading...' })
const jsonData = computed(() => JSON.stringify(responseData.value.response, null, 2))
const statusColor = computed(() =>
  responseData.value.status < 400 ? 'text-green-500' : 'text-red-500'
)
</script>
