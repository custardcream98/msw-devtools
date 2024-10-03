import fs from "fs"

export const loadDependencyList = () => {
  const packageJsonString = fs.readFileSync("package.json", "utf-8")

  const packageJson = JSON.parse(packageJsonString)

  return {
    dependencies: packageJson.dependencies
      ? Object.keys(packageJson.dependencies)
      : undefined,
    devDependencies: packageJson.devDependencies
      ? Object.keys(packageJson.devDependencies)
      : undefined
  }
}
