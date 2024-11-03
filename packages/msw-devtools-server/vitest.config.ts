import { defaultExclude, defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ["json-summary", "json"],
      exclude: [
        ...defaultExclude,
        "**/__tests__/**",
        "**/*.d.ts",
        "**/types/**",
        "**/types.ts",
        "**/constants/**",
        "**/constants.ts",
        "**/index.ts"
      ]
    },
    clearMocks: true
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      "package.json": path.resolve(__dirname, "./package.json"),
      core: path.resolve(__dirname, "../core/src")
    }
  }
})
