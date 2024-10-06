import MSWDevtoolsWebpackPlugin from "@custardcream/msw-devtools-webpack-plugin"

/**
 * @param {import('webpack').Configuration} config
 * @param {import("next/dist/server/config-shared").WebpackConfigContext} context
 **/
const webpack = (config, { isServer }) => {
  if (isServer) {
    config.plugins = [...(config.plugins || []), new MSWDevtoolsWebpackPlugin()]
  }

  return config
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack
}

export default nextConfig
