import {
  scopedPreflightStyles,
  isolateInsideOfContainer
} from "tailwindcss-scoped-preflight"

import plugin from "tailwindcss/plugin"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "msw-d-",
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
      ]
    },
    extend: {
      zIndex: {
        "msw-devtool": 999999
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
      isolationStrategy: isolateInsideOfContainer("#msw-devtool")
    }),
    plugin(function ({ addComponents, addUtilities, theme }) {
      addComponents({
        ".textarea": {
          resize: "none",
          borderRadius: theme("borderRadius.lg"),
          backgroundColor: theme("colors.slate.50"),
          padding: theme("spacing.2"),
          fontSize: theme("fontSize.base"),
          lineHeight: theme("lineHeight.6"),
          color: theme("colors.slate.700"),
          ...MSW_BORDER(theme)
        },
        ".button": {
          padding: `${theme("spacing.1")} ${theme("spacing.2")}`,
          ...BUTTON(theme)
        },
        ".button-lg": {
          padding: `${theme("spacing.3")}`,
          ...BUTTON(theme)
        },
        ".button-icon": {
          padding: `${theme("spacing.2")}`,
          ...BUTTON(theme)
        }
      })

      addUtilities({
        ".msw-border": MSW_BORDER(theme)
      })
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
