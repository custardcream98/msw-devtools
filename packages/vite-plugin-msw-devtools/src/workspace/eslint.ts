export const eslint = async (targets: string[]) => {
  const { ESLint } = await import("eslint")

  const eslint = new ESLint({
    fix: true
  })

  const results = await eslint.lintFiles(targets)

  await ESLint.outputFixes(results)

  const formatter = await eslint.loadFormatter("stylish")
  await formatter.format(results)
}
