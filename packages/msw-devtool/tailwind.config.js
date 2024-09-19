import {
  scopedPreflightStyles,
  isolateInsideOfContainer
} from "tailwindcss-scoped-preflight"

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
    })
  ]
}
