import {
  scopedPreflightStyles,
  isolateInsideOfContainer
} from "tailwindcss-scoped-preflight"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "msw-d-",
  theme: {
    extend: {}
  },
  plugins: [
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer("#msw-devtool")
    })
  ]
}
