import packageJson from "./package.json"

import postcss from "rollup-plugin-postcss"

import commonjs from "@rollup/plugin-commonjs"
import image from "@rollup/plugin-image"
import json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import autoprefixer from "autoprefixer"
import path from "path"
import { dts } from "rollup-plugin-dts"
import { swc } from "rollup-plugin-swc3"
import sass from "sass"

/**
 * NOTE:
 * 모노레포에서 서비스가 메인이라면 빌드할 필요는 없다.
 * 패키지가 메인이라면 빌드 후 배포하면 된다.
 */

const getRollupConfig = () => {
  const packagePath = __dirname
  const { main, module, types } = packageJson

  const isDevelopment = process.env.NODE_ENV === "development"

  const tsconfigPath = "tsconfig.rollup.json"

  return [
    {
      external: [...Object.keys(packageJson.peerDependencies || {})],
      input: "src/index.ts",
      output: [
        {
          dir: path.resolve(main, "../"),
          exports: "named",
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "src",
          sourcemap: !isDevelopment
        },
        {
          dir: path.resolve(module, "../"),
          exports: "named",
          format: "esm",
          preserveModules: true,
          preserveModulesRoot: "src",
          sourcemap: !isDevelopment
        }
      ],
      plugins: [
        json(),
        image(),
        nodeResolve(),
        swc({
          exclude: "node_modules/**",
          jsc: { minify: { sourceMap: !isDevelopment } },
          minify: !isDevelopment,
          sourceMaps: !isDevelopment,
          tsconfig: tsconfigPath
        }),
        postcss({
          extensions: [".sass", ".css"],
          extract: "index.css",
          plugins: [autoprefixer],
          preprocessor: (content, id) =>
            new Promise((resolve, reject) => {
              const result = sass.renderSync({ file: id })
              resolve({ code: result.css.toString() })
            }),
          sourceMap: isDevelopment
        }),
        commonjs()
      ]
    },
    {
      input: "src/index.ts",
      output: [
        {
          file: types,
          format: "esm"
        }
      ],
      plugins: [
        dts({
          tsconfig: tsconfigPath
        })
      ]
    }
  ]
}

const rollupConfigs = getRollupConfig()

export default rollupConfigs
