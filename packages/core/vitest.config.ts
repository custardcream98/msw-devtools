import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      reporter: ["json-summary", "json"],
      exclude: [
        "**/types/**",
        "**/types.ts",
        "**/constants/**",
        "**/constants.ts",
        "**/index.ts"
      ]
    }
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src")
    }
  }
})
