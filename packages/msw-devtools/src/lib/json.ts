import { jsonrepair } from "jsonrepair"

export const checkJSONParsable = (value: string) => {
  try {
    JSON.parse(value)
    return true
  } catch (error) {
    return false
  }
}

export const checkJSONFixable = (value: string) => {
  try {
    jsonrepair(value)
    return true
  } catch (error) {
    return false
  }
}
