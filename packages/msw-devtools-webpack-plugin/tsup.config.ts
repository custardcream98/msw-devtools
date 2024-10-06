import { defineConfig } from "tsup"

export default defineConfig([
  {
    entry: ["src/index.ts"],
    sourcemap: false,
    clean: true,
    format: ["cjs", "esm"]
  },
  {
    entry: ["src/index.ts"],
    splitting: false,
    sourcemap: false,
    format: "esm",
    dts: {
      only: true
    }
  }
])
