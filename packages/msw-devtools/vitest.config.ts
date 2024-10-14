import { defaultExclude, defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      reporter: ["json-summary", "json"],
      exclude: [
        ...defaultExclude,
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
      "~": path.resolve(__dirname, "./src"),
      core: path.resolve(__dirname, "../core/src")
    }
  }
})
