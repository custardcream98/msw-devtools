# @custardcream/msw-devtools

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

https://github.com/user-attachments/assets/32a3c68b-b58f-426b-9813-bfacbdbd843f

### Export/Import Mock Handlers

https://github.com/user-attachments/assets/26814706-ac15-47c5-8603-f7acc14b5342

---

## 🚀 Installation

To get started, install the package via npm:

```bash
npm install msw-devtools
```

---

## 🛠 Usage

Here's how you can integrate it into your project:

```jsx
import { setupWorker } from "msw/browser"
import { installMSWDevtool } from 'msw-devtool';

const enableMocking = async () => {
  // Exclude devtool from production builds
  if (import.meta.env.DEV) {
    return await installMSWDevtool({
      initialOpen: true, // Automatically open devtool on start
      api: setupWorker() // Initialize MSW worker
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