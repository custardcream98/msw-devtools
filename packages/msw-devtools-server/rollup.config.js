import { defineConfig } from "rollup"

import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import tsConfigPaths from "rollup-plugin-tsconfig-paths"
import { dts } from "rollup-plugin-dts"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import del from "rollup-plugin-delete"
import json from "@rollup/plugin-json"

import packageJson from "./package.json"

export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: process.env.NODE_ENV === "development"
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: process.env.NODE_ENV === "development"
      }
    ],
    plugins: [
      del({
        targets: [packageJson.main, packageJson.module]
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
  },
  // Build Types
  {
    input: "src/index.ts",
    output: {
      file: packageJson.types,
      format: "esm"
    },
    plugins: [
      del({
        targets: [packageJson.types]
      }),
      tsConfigPaths(),
      dts({
        compilerOptions: {
          external: ["msw"] // 'msw'를 외부 모듈로 처리
        }
      })
    ]
  },
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
