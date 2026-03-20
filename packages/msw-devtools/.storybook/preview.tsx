import React from "react"

import type { Preview } from "@storybook/react"

import initializeI18n from "../src/lib/i18n"

import "../src/index.css"

// Storybook 환경에서 i18n 초기화
initializeI18n()

const preview: Preview = {
  decorators: [
    (Story) => (
      <div id='msw-devtools'>
        <Story />
      </div>
    )
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
