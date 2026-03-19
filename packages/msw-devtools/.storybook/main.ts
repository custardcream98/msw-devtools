import path from "path"

import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  viteFinal: async (config) => {
    const srcPath = path.resolve(__dirname, "../src")

    config.resolve = config.resolve || {}

    // Vite alias를 배열 형태로 정의 (순서 보장, 우선순위 높은 것부터)
    const existingAlias = config.resolve.alias
    const aliasArray = Array.isArray(existingAlias) ? existingAlias : []

    config.resolve.alias = [
      // MSW/Server 모듈 mock (가장 우선)
      {
        find: "~/lib/msw",
        replacement: path.resolve(__dirname, "./mocks/msw")
      },
      {
        find: "~/lib/server",
        replacement: path.resolve(__dirname, "./mocks/server")
      },
      // tsconfig path alias
      { find: /^~\//, replacement: srcPath + "/" },
      ...aliasArray
    ]

    return config
  }
}

export default config
