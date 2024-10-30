<script setup lang="ts">
import FetchTest from './components/FetchTest.vue'
</script>

<style module>
.wrapper {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
.description {
  line-height: 1.5;
}
</style>

<template>
  <h3>
    <a
      href="https://www.npmjs.com/package/@custardcream/msw-devtools"
      target="_blank"
      rel="noreferrer"
    >
      @custardcream/msw-devtools
    </a>
    Vue.js Demo
  </h3>
  <p :class="$style.description">
    Try adding mock request handler of APIs below and click <code>REFETCH</code> button to see the
    request gets mocked.
  </p>
  <div :class="$style.wrapper">
    <Suspense>
      <template #default>
        <FetchTest targetUrl="https://jsonplaceholder.typicode.com/todos" />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
    <Suspense>
      <template #default>
        <FetchTest targetUrl="https://jsonplaceholder.typicode.com/comments" />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
    <Suspense>
      <template #default>
        <FetchTest targetUrl="https://jsonplaceholder.typicode.com/albums" />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>
