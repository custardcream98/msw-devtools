import type { PluginOptions } from "~/types"
import { checkTypescript } from "~/workspace/check-config-files"

const isUsingTypescript = checkTypescript()

type PickRequired<T, Key extends keyof T> = {
  [K in Key]-?: T[K]
} & Omit<T, Key>

let _pluginOptions: PickRequired<
  PluginOptions,
  "jsonOutputPath" | "scriptOutputPath"
>

export const getPluginOptions = () => _pluginOptions

export const setPluginOptions = (options: PluginOptions) => {
  if (options) {
    _pluginOptions = {
      scriptOutputPath:
        options.scriptOutputPath ??
        "mock-handlers." + (isUsingTypescript ? "ts" : "mjs"),
      jsonOutputPath: options.jsonOutputPath ?? "./mock-list.json",
      generateScript: options.generateScript ?? true,
      generateJson: options.generateJson ?? false
    }
  }
}
