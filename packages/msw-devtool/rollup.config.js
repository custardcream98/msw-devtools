import path from "path"

import { defineConfig } from "rollup"

import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import babel from "@rollup/plugin-babel"
import tsConfigPaths from "rollup-plugin-tsconfig-paths"
import { dts } from "rollup-plugin-dts"
import postcss from "rollup-plugin-postcss"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import del from "rollup-plugin-delete"
import json from "@rollup/plugin-json"

import packageJson from "./package.json"

const COMMON_JS_DIR = path.dirname(packageJson.main)
const ES_MODULE_DIR = path.dirname(packageJson.module)
const TYPES_FILE = packageJson.types

export default defineConfig([
  {
    input: "src/index.tsx",
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
      tsConfigPaths(),
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: [/.css$/]
      }),
      json(),
      postcss({
        minimize: true
      }),
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-env", "@babel/preset-react"],
        babelHelpers: "bundled"
      }),
      terser()
    ]
  },
  // Build Types
  {
    input: "src/index.tsx",
    output: {
      file: TYPES_FILE,
      format: "esm"
    },
    plugins: [
      tsConfigPaths(),
      dts({
        exclude: [/.css$/]
      })
    ]
  }
])
