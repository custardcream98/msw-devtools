import { http, HttpResponse } from "msw"

const getRecipesRecipes = (response = "this is aweesome!") => {
  return http["get"]("https://api.sampleapis.com/recipes/recipes", () =>
    HttpResponse.json(response)
  )
}
const getSwitchGames = (response = "sample") => {
  return http["get"]("https://api.sampleapis.com/switch/games", () =>
    HttpResponse.json(response)
  )
}
const getWinesReds = (response = "response 1") => {
  return http["get"]("https://api.sampleapis.com/wines/reds", () =>
    HttpResponse.json(response)
  )
}

export const handlers = {
  getRecipesRecipes,
  getSwitchGames,
  getWinesReds
}
