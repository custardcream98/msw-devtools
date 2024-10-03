# @custardcream/vite-plugin-msw-devtools

A Vite plugin for MSW Devtools.

> This plugin is still in development and may not be stable.

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
