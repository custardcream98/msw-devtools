import path from "path"

import { defineConfig } from "rollup"

import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import tsConfigPaths from "rollup-plugin-tsconfig-paths"
import { dts } from "rollup-plugin-dts"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import del from "rollup-plugin-delete"
import json from "@rollup/plugin-json"

import packageJson from "./package.json"

const COMMON_JS_DIR = path.dirname(packageJson.main)
const ES_MODULE_DIR = path.dirname(packageJson.module)
const TYPES_FILE = packageJson.types

export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        dir: COMMON_JS_DIR,
        format: "cjs",
        sourcemap: process.env.NODE_ENV === "development"
      },
      {
        dir: ES_MODULE_DIR,
        format: "esm",
        sourcemap: process.env.NODE_ENV === "development"
      }
    ],
    plugins: [
      del({
        targets: [COMMON_JS_DIR, ES_MODULE_DIR]
      }),
      peerDepsExternal({
        includeDependencies: true
      }),
      tsConfigPaths(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json"
      }),
      json(),
      terser()
    ]
  },
  // Build Types
  {
    input: "src/index.ts",
    output: {
      file: TYPES_FILE,
      format: "esm"
    },
    plugins: [tsConfigPaths(), dts()]
  }
])