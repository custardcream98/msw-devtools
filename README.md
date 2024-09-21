# @custardcream/msw-devtools

[ENGLISH](./README-EN.md)

**프레임워크에 구애받지 않는 MSW 핸들러 관리 도구**

MSW 핸들러를 손쉽게 관리하세요.

### 주요 기능:

- 🛠 **모킹 핸들러를 런타임에 추가** – 새로운 모킹 핸들러를 앱의 동작중에 추가할 수 있습니다.
- ✏️ **모킹 핸들러의 응답 수정** – 모킹 핸들러의 응답을 빠르게 수정할 수 있습니다.
- 🔄 **모킹 핸들러 내보내기/가져오기** – 핸들러 구성을 손쉽게 내보내고 가져올 수 있습니다.

---

## 📺 데모

[데모 페이지](https://msw-devtools.vercel.app/)

### 모킹 핸들러 추가

https://github.com/user-attachments/assets/32a3c68b-b58f-426b-9813-bfacbdbd843f

### 모킹 핸들러 내보내기/가져오기

https://github.com/user-attachments/assets/26814706-ac15-47c5-8603-f7acc14b5342

---

## 🚀 설치 방법

npm을 통해 패키지를 설치하세요.

```bash
npm install msw-devtools
```

---

## 🛠 사용법

```jsx
import { setupWorker } from "msw/browser"
import { installMSWDevtool } from 'msw-devtool';

const enableMocking = async () => {
  // 프로덕션 빌드에서는 Devtools를 번들에 포함시키지 않습니다.
  if (import.meta.env.DEV) {
    return await installMSWDevtool({
      initialOpen: true, // Devtools 열린 상태로 시작
      api: setupWorker() // MSW 워커 초기화
    })
  }
}

// 어떤 프레임워크를 사용해도 상관없습니다.
enableMocking().then(() =>
  ReactDomClient.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
)
```
