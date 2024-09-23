import { indentWithTab } from "@codemirror/commands"
import { json } from "@codemirror/lang-json"
import { vscodeDark } from "@uiw/codemirror-theme-vscode"
import ReactCodeMirror, {
  type BasicSetupOptions,
  keymap,
  type ReactCodeMirrorProps,
  type ReactCodeMirrorRef
} from "@uiw/react-codemirror"
import { clsx } from "clsx"
import React, { useImperativeHandle, useMemo, useRef } from "react"

const EXTENSIONS = [
  json(),
  keymap.of([
    {
      key: "Tab",
      run: (target) => {
        if (target.state.readOnly) return false

        const { head } = target.state.selection.main
        const $index = target.state.doc.sliceString(head).indexOf("$")

        if ($index !== -1) {
          target.dispatch({
            selection: {
              anchor: head + $index,
              head: head + $index + 1
            }
          })
          return true
        } else {
          const $index = target.state.doc.sliceString(0, head).indexOf("$")

          if ($index !== -1) {
            target.dispatch({
              selection: {
                anchor: $index,
                head: $index + 1
              }
            })
            return true
          }
        }

        return indentWithTab.run?.(target) ?? false
      }
    }
  ])
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
  Omit<
    ReactCodeMirrorProps,
    "onFocus" | "extensions" | "theme" | "onFocus" | "indentWithTab"
  >
>(({ className, basicSetup: basicSetupProp, ...props }, ref) => {
  const innerRef = useRef<ReactCodeMirrorRef>(null)

  useImperativeHandle(ref, () => innerRef.current!, [])

  const basicSetup = useMemo(
    () =>
      typeof basicSetupProp === "boolean"
        ? basicSetupProp
          ? BASIC_SETUP_OPTIONS
          : undefined
        : {
            ...BASIC_SETUP_OPTIONS,
            ...basicSetupProp
          },
    [basicSetupProp]
  )

  return (
    <div className={clsx(className, "overflow-auto")}>
      <ReactCodeMirror
        ref={innerRef}
        className='overflow-hidden text-xs msw-round-border'
        extensions={EXTENSIONS}
        basicSetup={basicSetup}
        theme={vscodeDark}
        minHeight='100px'
        onFocus={() => {
          const view = innerRef.current?.view

          if (view) {
            setTimeout(() => {
              const doc = view.state.doc.toString()
              const firstDollarIndex = doc.indexOf("$")

              if (firstDollarIndex !== -1) {
                view.dispatch({
                  selection: {
                    anchor: firstDollarIndex,
                    head: firstDollarIndex + 1
                  }
                })
                view.focus()
              }
            }, 0)
          }
        }}
        indentWithTab={false}
        {...props}
      />
    </div>
  )
})
