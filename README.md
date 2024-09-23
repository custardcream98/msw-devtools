# @custardcream/msw-devtools

[KOREAN](./README/README.ko.md)

**Framework Agnostic Devtools for Managing MSW Handlers**

Easily manage your MSW handlers with this versatile devtool, suitable for any framework.

### Key Features:

- 🛠 **Add Mock Handlers On The Fly** – Instantly add new mock handlers.
- ✏️ **Edit Mock Handler's Response** – Modify responses of mock handlers.
- 🔄 **Export/Import Mock Handlers** – Seamlessly export and import handler configurations.

---

## 📺 Demo

[Try Demo Here](https://msw-devtools.vercel.app/)

### Add Mock Handler

https://github.com/user-attachments/assets/3f5f6d2e-ead6-4632-ab6b-90275c08082d

### Export/Import Mock Handlers

https://github.com/user-attachments/assets/26814706-ac15-47c5-8603-f7acc14b5342

---

## 🚀 Installation

To get started, install the package via npm:

```bash
npm install -D @custardcream/msw-devtools msw
```

---

## 🛠 Usage

Here's how you can integrate it into your project:

```jsx
import { setupWorker } from "msw/browser"
import { installMSWDevtools } from "@custardcream/msw-devtools"

const enableMocking = async () => {
  // Exclude devtool from production builds
  if (import.meta.env.DEV) {
    return await installMSWDevtools({
      initialOpen: true, // Automatically open devtool on start
      setupWorker: setupWorker() // Initialize MSW worker
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
