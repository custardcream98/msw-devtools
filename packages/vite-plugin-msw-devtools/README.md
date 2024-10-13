# @custardcream/vite-plugin-msw-devtools

A Vite plugin for MSW Devtools.

> (DEPRECATED) This package has been deprecated in favor of `@custardcream/msw-devtools-server`. Please use [`@custardcream/msw-devtools-server`](../../README.md#live-json-editing-for-instant-management-of-msw-request-handlers) instead.

## Features

- Automatically generate MSW Request Handlers from the Devtools UI
- Automatically generate Request Handlers JSON from the Devtools UI

## Installation

```bash
npm install -D @custardcream/vite-plugin-msw-devtools
```

## Usage

```javascript
import { defineConfig } from "vite"
import mswDevtools from "@custardcream/vite-plugin-msw-devtools"

export default defineConfig({
  plugins: [
    mswDevtools({
      generateScript: true,
      scriptOutputPath: "src/__tests__/mock/handlers.ts",
      generateJson: true,
      jsonOutputPath: "src/__tests__/mock/list.json"
    })
  ]
})
```
