import { defineConfig } from "rollup"

import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import tsConfigPaths from "rollup-plugin-tsconfig-paths"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import del from "rollup-plugin-delete"
import json from "@rollup/plugin-json"

import packageJson from "./package.json"

export default defineConfig([
  {
    input: "src/cli/index.ts",
    output: {
      file: packageJson.bin["msw-devtools-server"],
      format: "cjs",
      sourcemap: process.env.NODE_ENV === "development"
    },
    plugins: [
      del({
        targets: [packageJson.bin["msw-devtools-server"]]
      }),
      peerDepsExternal({
        includeDependencies: true
      }),
      tsConfigPaths(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: [/.(test|spec).(ts|tsx)$/],
        include: ["src/**/*", "../core/src/**/*"]
      }),
      resolve({
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }),
      commonjs(),
      json()
    ]
  }
])
