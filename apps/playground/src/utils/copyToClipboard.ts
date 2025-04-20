export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement("textarea")
    textarea.value = text

    textarea.style.position = "absolute"
    textarea.style.left = "-9999px"

    document.body.appendChild(textarea)
    textarea.select()

    document.execCommand("copy")

    document.body.removeChild(textarea)
  }
}
