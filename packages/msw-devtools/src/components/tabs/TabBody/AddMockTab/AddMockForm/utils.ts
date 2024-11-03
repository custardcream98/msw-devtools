import { checkJSONFixable, checkJSONParsable } from "~/lib/json"

export const validate = (value: string) => {
  if (!value) {
    return false
  }

  if (checkJSONParsable(value)) {
    return true
  }

  if (checkJSONFixable(value)) {
    return "FIXABLE"
  }

  return false
}
