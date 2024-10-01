import {
  FIELD_NAME,
  FormFieldResponseValue,
  type FormFieldValues
} from "~/constants"

export const isSameFormFieldValues = (
  a: FormFieldValues,
  b: FormFieldValues
) => {
  return (
    a[FIELD_NAME.URL] === b[FIELD_NAME.URL] &&
    a[FIELD_NAME.METHOD] === b[FIELD_NAME.METHOD] &&
    a[FIELD_NAME.STATUS] === b[FIELD_NAME.STATUS] &&
    a[FIELD_NAME.RESPONSE_DELAY] === b[FIELD_NAME.RESPONSE_DELAY] &&
    isSameResponse(a[FIELD_NAME.RESPONSE], b[FIELD_NAME.RESPONSE])
  )
}

const isSameResponse = (
  a: FormFieldResponseValue,
  b: FormFieldResponseValue
) => {
  return (
    a.type === b.type &&
    (a.type === "sequential" && b.type === "sequential"
      ? a.response.every((response) => b.response.includes(response))
      : a.response === b.response)
  )
}
