type Type = "client" | "server"

export const colorLog = (
  type: Type,
  color: "red" | "blue",
  message: string
) => {
  if (type === "client") {
    return [`%c${message}`, `color: ${color}`]
  } else {
    return [`\x1b[${color === "red" ? "31" : "34"}m ${message}\x1b[0m`]
  }
}

export const logger = (type: Type) => {
  const prefix = type === "client" ? "MSW DevTools" : "MSW DevTools Server"

  return {
    info: (message: string) => {
      console.log(...colorLog(type, "blue", `[${prefix}] ${message}`))
    },
    error: (message: string) => {
      console.error(...colorLog(type, "red", `[${prefix}] ${message}`))
    }
  }
}
