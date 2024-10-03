import { loadDependencyList } from "~/workspace/packageJson"

const dependencyList = loadDependencyList()

export const checkTypescript = () =>
  dependencyList.devDependencies?.includes("typescript")

export const checkEslint = () =>
  dependencyList.devDependencies?.includes("eslint")
