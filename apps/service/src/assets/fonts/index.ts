import localFont from "next/font/local"

export const pretendard = localFont({
  adjustFontFallback: "Arial",
  display: "swap",
  fallback: [
    "Pretendard",
    "-apple-system",
    "BlinkMacSystemFont",
    "system-ui",
    "Roboto",
    "Helvetica Neue",
    "Segoe UI",
    "Apple SD Gothic Neo",
    "Noto Sans KR",
    "Malgun Gothic",
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "sans-serif"
  ],
  preload: true,
  src: "./PretendardVariable.woff2",
  style: "normal",
  variable: "--font-pretendard"
})
