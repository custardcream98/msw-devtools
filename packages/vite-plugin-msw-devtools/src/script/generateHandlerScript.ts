import type { JsonMock } from "core"

export const generateHandlerScript = (mock: JsonMock) => {
  const name = urlToName(mock.url)
  const handlerName = `${mock.method}${name}`

  const script = `const ${handlerName} = (response = ${mock.response.type === "sequential" ? JSON.stringify(mock.response.response[0], null, 2) : JSON.stringify(mock.response.response, null, 2)}) => {
    return http["${mock.method}"]("${mock.url}", () => 
      HttpResponse.json(response)
    )
  }`

  return {
    handlerName,
    script
  }
}

const urlToName = (url: string) => {
  const path = /http?s:\/\/[^/]*\/(.*)/.exec(url)?.[1]

  if (!path) {
    return "index"
  }

  const parts = path.split(/[-/:]/).filter(Boolean)

  return parts.map((part) => part[0].toUpperCase() + part.slice(1)).join("")
}
