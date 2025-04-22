import clsx from "clsx"
import { useState } from "react"

import { ClipboardCheckSVG } from "./assets/ClipboardCheckSVG"
import { ClipboardSVG } from "./assets/ClipboardSVG"
import { ENDPOINT } from "./constants"

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
}

export const ApiEndpointButton = () => {
  const [copied, setCopied] = useState(false)

  return (
    <button
      className={clsx(
        "text-sm md:text-base",
        "flex cursor-pointer items-center gap-x-2 rounded-xl bg-gray-800 px-3 py-2 font-mono",
        "transition-all duration-300",
        "hover:bg-gray-900"
      )}
      type='button'
      onClick={async () => {
        await copyToClipboard(ENDPOINT)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }}
    >
      {ENDPOINT}
      {copied ? (
        <ClipboardCheckSVG className='ml-2 h-4 w-4 text-green-500' />
      ) : (
        <ClipboardSVG className='ml-2 h-4 w-4' />
      )}
    </button>
  )
}
