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
    clearMocks: true,
    mockReset: true,
    restoreMocks: true
  }
})
