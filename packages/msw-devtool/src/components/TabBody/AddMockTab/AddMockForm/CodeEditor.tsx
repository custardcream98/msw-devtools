import { json } from "@codemirror/lang-json"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import ReactCodeMirror, {
  type BasicSetupOptions,
  type ReactCodeMirrorProps,
  type ReactCodeMirrorRef
} from "@uiw/react-codemirror"
import { clsx } from "clsx"
import React, { useImperativeHandle, useRef } from "react"

const EXTENSIONS = [
  json()
  // keymap.of([
  //   {
  //     key: "Tab",
  //     run: ({ state, dispatch }) => {
  //       if (state.readOnly) return false
  //       dispatch({
  //         changes: {
  //           from: state.selection.main.head,
  //           to: state.selection.main.head,
  //           insert: "  "
  //         },
  //         selection: EditorSelection.cursor(state.selection.main.head + 2, 0)
  //       })
  //       return true
  //     }
  //   }
  // ])
]
const BASIC_SETUP_OPTIONS: BasicSetupOptions = {
  lineNumbers: false,
  highlightActiveLineGutter: false,
  highlightSpecialChars: true,
  history: true,
  foldGutter: true,
  drawSelection: true,
  dropCursor: true,
  allowMultipleSelections: true,
  indentOnInput: true,
  syntaxHighlighting: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: true,
  rectangularSelection: true,
  crosshairCursor: true,
  highlightActiveLine: true,
  highlightSelectionMatches: true,
  closeBracketsKeymap: true,
  defaultKeymap: true,
  searchKeymap: true,
  historyKeymap: true,
  foldKeymap: false,
  completionKeymap: true,
  lintKeymap: true
}

export const CodeEditor = React.forwardRef<
  ReactCodeMirrorRef,
  Omit<ReactCodeMirrorProps, "onFocus"> & {
    onFocus?: (ref: ReactCodeMirrorRef) => void
  }
>(({ className, onFocus, ...props }, ref) => {
  const innerRef = useRef<ReactCodeMirrorRef>(null)

  useImperativeHandle(ref, () => innerRef.current!, [])

  return (
    <div className={clsx(className, "msw-d-overflow-auto")}>
      <ReactCodeMirror
        ref={innerRef}
        className='msw-d-overflow-hidden msw-d-msw-round-border'
        extensions={EXTENSIONS}
        basicSetup={BASIC_SETUP_OPTIONS}
        theme={vscodeDark}
        minHeight='100px'
        onFocus={() => {
          onFocus?.(innerRef.current!)
        }}
        {...props}
      />
    </div>
  )
})
