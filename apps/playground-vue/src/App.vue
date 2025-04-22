<script setup lang="ts">
import ApiEndpointButton from './components/ApiEndpointButton.vue'
import ResponseDisplay from './components/ResponseDisplay.vue'
</script>

<template>
  <div class="flex h-screen w-screen flex-col items-center justify-center gap-5 px-5 md:px-20">
    <ApiEndpointButton />
    <div class="relative w-full max-w-4xl">
      <ResponseDisplay />
    </div>
  </div>
</template>
