import fs from "fs"
import path from "path"

const rootPath = process.cwd()
console.log(path.resolve(rootPath, "package.json"))

export const loadDependencyList = () => {
  const packageJsonString = fs.readFileSync("package.json", "utf-8")

  const packageJson = JSON.parse(packageJsonString)

  console.log("packageJson", packageJson)

  console.log(typeof packageJson)

  console.log(Object.keys(packageJson))

  return {
    dependencies: packageJson.dependencies
      ? Object.keys(packageJson.dependencies)
      : undefined,
    devDependencies: packageJson.devDependencies
      ? Object.keys(packageJson.devDependencies)
      : undefined
  }
}
