import { test, expect } from "@playwright/test"

test("has floating devtools button", async ({ page }) => {
  await page.goto("/")

  const floatingButton = page.getByRole("button", { name: "Open MSW Devtools" })

  await expect(floatingButton).toBeVisible()
})

test("devtools opened by default", async ({ page }) => {
  await page.goto("/")

  const panel = page.getByRole("region", { name: "MSW Devtools" })

  await expect(panel).toBeVisible()
})

test("devtools closes on close button click", async ({ page }) => {
  await page.goto("/")

  const closeButton = page.getByRole("button", { name: "Close MSW Devtools" })

  await closeButton.click()

  const panel = page.getByRole("region", { name: "MSW Devtools" })

  await expect(panel).not.toBeInViewport()
})

test("devtools re opens on floating button click", async ({ page }) => {
  await page.goto("/")

  const closeButton = page.getByRole("button", { name: "Close MSW Devtools" })

  await closeButton.click()

  const floatingButton = page.getByRole("button", { name: "Open MSW Devtools" })

  await floatingButton.click()

  const panel = page.getByRole("region", { name: "MSW Devtools" })

  await expect(panel).toBeInViewport()
})
