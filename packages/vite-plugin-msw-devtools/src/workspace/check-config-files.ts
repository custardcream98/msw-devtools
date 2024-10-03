import { loadDependencyList } from "~/workspace/packageJson"

const dependencyList = loadDependencyList()

console.log("dependencyList", dependencyList)

export const checkTypescript = () =>
  dependencyList.devDependencies?.includes("typescript")

export const checkEslint = () =>
  dependencyList.devDependencies?.includes("eslint")
