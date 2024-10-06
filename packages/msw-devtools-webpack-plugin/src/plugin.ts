import type * as webpack from "webpack"

export class MSWDevtoolsWebpackPlugin {
  constructor() {}
  apply(compiler: webpack.Compiler) {
    compiler.hooks.emit.tapAsync("MSWDevtoolsWebpackPlugin", (_, callback) => {
      callback()
    })
  }
}
