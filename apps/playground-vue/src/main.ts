import './assets/global.css'

import { installMSWDevtools } from '@custardcream/msw-devtools'
import { setupWorker } from 'msw/browser'
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import 'highlight.js/styles/atom-one-dark.min.css'

const enableMocking = async () => {
  // if (import.meta.env.DEV) {
  // commented out for demo purposes
  return await installMSWDevtools({
    initialOpen: true,
    setupWorker: setupWorker(),
    options: {
      onUnhandledRequest: 'bypass'
    }
  })
  // }
}

enableMocking().then(() => {
  const app = createApp(App)
  app.use(VueQueryPlugin)
  app.mount('#app')
})
