import { setupServer } from "msw/node"
import { afterAll, beforeAll, beforeEach, expect, it } from "vitest"

import { handlers } from "./handlers"

const server = setupServer()

beforeAll(() => {
  server.listen()
})

beforeEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

const fetchTest = async (url: string) => {
  const response = await fetch(url)
  return await response.json()
}

it("test generated handlers", async () => {
  server.use(
    handlers.getRecipesRecipes(),
    handlers.getSwitchGames(),
    handlers.getWinesReds()
  )

  expect(
    await fetchTest("https://api.sampleapis.com/recipes/recipes")
  ).toMatchInlineSnapshot(`"this is aweesome!"`)
  expect(
    await fetchTest("https://api.sampleapis.com/switch/games")
  ).toMatchInlineSnapshot(`"sample"`)
  expect(
    await fetchTest("https://api.sampleapis.com/wines/reds")
  ).toMatchInlineSnapshot(`"response 1"`)
})
