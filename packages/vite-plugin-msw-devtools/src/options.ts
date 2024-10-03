import type { PluginOptions } from "~/types"

const isPluginOptions = (target: unknown): target is PluginOptions => {
  return (
    typeof target === "object" &&
    target !== null &&
    "outputPath" in target &&
    typeof target.outputPath === "string"
  )
}

let _pluginOptions: PluginOptions | null = null

export const getPluginOptions = () => _pluginOptions

export const setPluginOptions = (options: unknown) => {
  if (options && isPluginOptions(options)) {
    _pluginOptions = options
  }
}
