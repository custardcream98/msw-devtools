import './assets/main.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { installMSWDevtools } from '@custardcream/msw-devtools'
import { setupWorker } from 'msw/browser'

import { createApp } from 'vue'
import App from './App.vue'

const enableMocking = async () => {
  // if (import.meta.env.DEV) {
  return await installMSWDevtools({
    initialOpen: true,
    setupWorker: setupWorker(),
    options: {
      onUnhandledRequest: 'bypass'
    },
    isUsingServer: import.meta.env.DEV
  })
  // }
}

enableMocking().then(() => {
  const app = createApp(App)

  app.use(VueQueryPlugin)

  app.mount('#app')
})
