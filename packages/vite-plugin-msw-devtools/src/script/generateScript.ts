import type { JsonMock } from "core"

import { generateHandlerScript } from "./generateHandlerScript"

export const generateScript = (mockList: JsonMock[]) => {
  const handlers = mockList.map(generateHandlerScript)

  const script = `import { http, HttpResponse } from "msw"
  
  ${handlers.map(({ script }) => script).join("\n")}
  
  export const handlers = {
    ${handlers.map(({ handlerName }) => handlerName).join(",\n")}
  }
  `

  return script
}
