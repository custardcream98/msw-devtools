import fs from "fs"
import { format, resolveConfig } from "prettier"

export const prettier = async (targetPath: string) => {
  const options = (await resolveConfig(targetPath)) ?? undefined

  const text = fs.readFileSync(targetPath, "utf-8")

  const formatted = await format(text, {
    ...options,
    filepath: targetPath
  })

  fs.writeFileSync(targetPath, formatted)
}
