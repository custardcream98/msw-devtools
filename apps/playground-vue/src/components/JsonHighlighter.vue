<template>
  <highlightjs :code="code" language="json" />
</template>

<script lang="ts">
import hljsVuePlugin from '@highlightjs/vue-plugin'

export default {
  components: {
    highlightjs: hljsVuePlugin.component
  }
}
</script>

<script setup lang="ts">
import hljs from 'highlight.js'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/atom-one-dark.min.css'

hljs.registerLanguage('json', json)

defineProps<{
  code: string
}>()
</script>
