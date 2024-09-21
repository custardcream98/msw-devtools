import {
  scopedPreflightStyles,
  isolateInsideOfContainer
} from "tailwindcss-scoped-preflight"

import plugin from "tailwindcss/plugin"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  important: "#msw-devtools",
  theme: {
    fontFamily: {
      sans: [
        "Pretendard Variable",
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji"
      ],
      mono: [
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace"
      ]
    },
    extend: {
      zIndex: {
        "msw-devtools": 999999
      },
      colors: {
        background: {
          light: "#f4f6f9"
        }
      }
    }
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer("#msw-devtools")
    }),
    plugin(function ({ addComponents, addUtilities, theme }) {
      addComponents(
        {
          ".button": {
            padding: `${theme("spacing.1")} ${theme("spacing.2")}`,
            ...BUTTON(theme)
          },
          ".button-lg": {
            padding: `${theme("spacing.2")} ${theme("spacing.3")}`,
            ...BUTTON(theme)
          },
          ".button-icon": {
            padding: `${theme("spacing.2")}`,
            ...BUTTON(theme)
          }
        },
        {
          respectImportant: true
        }
      )

      addUtilities(
        {
          ".msw-border": MSW_BORDER(theme),
          ".msw-round-border": {
            borderRadius: theme("borderRadius.lg"),
            ...MSW_BORDER(theme)
          }
        },
        {
          respectImportant: true
        }
      )
    })
  ]
}

const MSW_BORDER = (theme) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: theme("colors.slate.200")
})

const BUTTON = (theme) => ({
  borderRadius: theme("borderRadius.lg"),
  cursor: "pointer",
  fontSize: theme("fontSize.sm"),
  lineHeight: theme("lineHeight.5"),
  transitionProperty: "background-color, color, font-weight",
  transitionDuration: "200ms"
})
