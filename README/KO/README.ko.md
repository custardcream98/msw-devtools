<h1 align="center">@custardcream/msw-devtools</h1>
<p align="center">
  <bold>프레임워크에 구애받지 않는 MSW 핸들러 관리 도구</bold>
  <br />
  <span>MSW 핸들러를 손쉽게 관리하세요!</span>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@custardcream/msw-devtools" target="_blank"><img src="https://img.shields.io/npm/v/@custardcream/msw-devtools.svg?style=for-the-badge&label=Latest&color=black" alt="Package version" /></a>
  <br />
  <br />
  <a href="https://github.com/custardcream98/msw-devtools">ENGLISH</a> | <a href="https://github.com/custardcream98/msw-devtools/blob/main/README/KO/README.ko.md">한국어</a>
</p>

<br />
<br />

## 주요 기능

- **어떤 프레임워크를 사용해도 상관없습니다.** React, Vue, Angular, Svelte 등 어떤 프레임워크를 사용하더라도 사용할 수 있습니다.
- **Mock Request Handler를 UI로 편리하게 관리하세요.** 손쉽게 추가, 수정, 삭제하거나 활성화, 비활성화할 수 있습니다.
- **상황에 따라 다른 응답값을 사용하세요.** 응답값이 순차적으로 바뀌게 할 수 있습니다.
- **Mock Request Handler를 내보내거나 가져오세요.** JSON 포멧으로 손쉽게 Mock Request Handler를 공유할 수 있습니다.
- 한국어를 지원합니다.

<br />

<p align="center">
  <img width="500" src="./image1.png">
  <img width="500" src="./image2.png">
  <img width="500" src="./image3.png">
</p>

<br />
<br />

## 데모

**[데모 페이지 (React.js)](https://msw-devtools.vercel.app/)**

**[데모 페이지 (Vue.js)](https://msw-devtools-vue.vercel.app/)**

## 설치 방법

npm을 통해 패키지를 설치하세요.

```bash
npm install -D @custardcream/msw-devtools msw
```

시작하기 전에 프로젝트에 MSW를 설정해주세요.

```bash
npx msw init public
```

### React.js 프로젝트에서 사용하기

```jsx
import { setupWorker } from "msw/browser"
import { installMSWDevtools } from "@custardcream/msw-devtools"

const enableMocking = async () => {
  // 프로덕션 빌드에서는 Devtools를 번들에 포함시키지 않습니다.
  if (import.meta.env.DEV) {
    return await installMSWDevtools({
      initialOpen: true, // Devtools 열린 상태로 시작
      setupWorker: setupWorker() // MSW 워커 초기화
      options: { // MSW 워커 설정
        onUnhandledRequest: "bypass"
      }
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

### Vue.js 프로젝트에서 사용하기

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

## 응답값 다이나믹하게 변경하기 (sequential response)

응답값을 다이나믹하게 변경해야 할 경우, 'sequential response'를 사용하세요.

<img width="500" src="./image4.png">

각 요청에 대한 응답값이 순차적으로 변경되게 됩니다.
