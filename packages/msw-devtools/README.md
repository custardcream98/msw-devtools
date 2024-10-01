<br />
<br />

<h1 align="center">@custardcream/msw-devtools</h1>
<p align="center">
  <bold>Framework Agnostic Devtools for Managing MSW Handlers</bold>
  <br />
  <span>Easily manage your mock request handlers</span>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@custardcream/msw-devtools" target="_blank"><img src="https://img.shields.io/npm/v/@custardcream/msw-devtools.svg?style=for-the-badge&label=Latest&color=black" alt="Package version" /></a>
  <br />
  <a href="https://github.com/custardcream98/msw-devtools">ENGLISH</a> | <a href="https://github.com/custardcream98/msw-devtools/blob/main/README/KO/README.ko.md">한국어</a>
</p>

<br />
<br />

## Features

- **Framework-Agnostic.** Works with any framework, including React, Vue, Angular, Svelte, and more.
- **Easily Manage Mock Request Handlers.** Add, edit, delete, enable, or disable mock request handlers with ease.
- **Use Different Response Data Based on the Situation.** Change response data sequentially.
- **Export and Import Mock Request Handlers.** Easily share mock request handlers in JSON format.

<br />

<p align="center">
  <img width="500" src="./README/EN/image1.png">
  <img width="500" src="./README/EN/image2.png">
  <img width="500" src="./README/EN/image3.png">
</p>

<br />
<br />

## Demo

**[React.js Demo](https://msw-devtools.vercel.app/)**

**[Vue.js Demo](https://msw-devtools-vue.vercel.app/)**

## Installation

To get started, install the package via npm:

```bash
npm install -D @custardcream/msw-devtools msw
```

Before integrating, make sure you have set up MSW in your project.

```bash
npx msw init public
```

### Integrating with React.js

```jsx
import { setupWorker } from "msw/browser"
import { installMSWDevtools } from "@custardcream/msw-devtools"

const enableMocking = async () => {
  // Exclude devtool from production builds
  if (import.meta.env.DEV) {
    return await installMSWDevtools({
      initialOpen: true, // Automatically open devtool on start
      setupWorker: setupWorker() // Initialize MSW worker
      options: { // MSW worker options
        onUnhandledRequest: "bypass",
      }
    })
  }
}

// You can use any framework you like
enableMocking().then(() =>
  ReactDomClient.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
)
```

### Integrating with Vue.js

```js
const enableMocking = async () => {
  if (import.meta.env.DEV) {
    return await installMSWDevtools({
      initialOpen: true,
      setupWorker: setupWorker(),
      options: {
        onUnhandledRequest: "bypass"
      }
    })
  }
}

enableMocking().then(() => {
  const app = createApp(App)

  app.use(VueQueryPlugin)

  app.mount("#app")
})
```

## Handling Dynamic Requests (sequential response)

In various cases, you may want to make response data dynamic.

You can achieve this by using the sequential response feature.

<img width="500" src="./README/EN/image4.png">

This feature allows you to change the response data for each request sequentially.
