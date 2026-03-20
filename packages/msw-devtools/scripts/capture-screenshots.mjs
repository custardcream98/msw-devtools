#!/usr/bin/env node
/**
 * Storybook 스토리에서 README용 스크린샷을 캡처하는 스크립트
 *
 * 사용법:
 *   1. pnpm build-storybook
 *   2. node scripts/capture-screenshots.mjs
 *
 * 전제조건:
 *   - storybook-static/ 디렉토리가 빌드되어 있어야 함
 *   - Playwright가 설치되어 있어야 함
 */
import { createServer } from "http"
import { existsSync, mkdirSync, readFileSync } from "fs"
import { dirname, extname, join, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const STORYBOOK_STATIC = resolve(ROOT, "storybook-static")
const README_EN = resolve(ROOT, "../../README/EN")

const CAPTURES = [
  {
    storyId: "tabs-addmocktab--default",
    output: resolve(README_EN, "image1.png"),
    description: "AddMock Tab"
  },
  {
    storyId: "tabs-mocklisttab--default",
    output: resolve(README_EN, "image2.png"),
    description: "MockList Tab"
  },
  {
    storyId: "tabs-settingstab--default",
    output: resolve(README_EN, "image3.png"),
    description: "Settings Tab"
  }
]

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
}

async function main() {
  if (!existsSync(STORYBOOK_STATIC)) {
    console.error(
      "storybook-static/ not found. Run pnpm build-storybook first."
    )
    process.exit(1)
  }

  for (const cap of CAPTURES) {
    const dir = dirname(cap.output)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
  }

  const server = createServer((req, res) => {
    let urlPath = req.url.split("?")[0]
    if (urlPath === "/") urlPath = "/index.html"

    const filePath = join(STORYBOOK_STATIC, urlPath)
    try {
      const content = readFileSync(filePath)
      const ext = extname(filePath)
      res.writeHead(200, {
        "Content-Type": MIME_TYPES[ext] || "application/octet-stream"
      })
      res.end(content)
    } catch {
      res.writeHead(404)
      res.end("Not found")
    }
  })

  const PORT = 6007
  await new Promise((resolve) => server.listen(PORT, resolve))
  console.log("Static server started on port " + PORT)

  const { chromium } = await import("playwright")
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 2
  })

  try {
    for (const cap of CAPTURES) {
      console.log("Capturing: " + cap.description + " (" + cap.storyId + ")...")
      const page = await context.newPage()
      const url =
        "http://localhost:" +
        PORT +
        "/iframe.html?id=" +
        cap.storyId +
        "&viewMode=story"
      await page.goto(url, { waitUntil: "networkidle" })
      await page.waitForTimeout(2000)
      await page.screenshot({ path: cap.output, fullPage: true })
      console.log("  -> " + cap.output)
      await page.close()
    }
    console.log("\nAll screenshots captured!")
  } finally {
    await browser.close()
    server.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
