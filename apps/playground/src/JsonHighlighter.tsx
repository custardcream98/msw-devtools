import SyntaxHighlighter from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"

export const JsonHighlighter = ({ children }: { children: string }) => {
  return (
    <SyntaxHighlighter language='json' style={atomOneDark}>
      {children}
    </SyntaxHighlighter>
  )
}
