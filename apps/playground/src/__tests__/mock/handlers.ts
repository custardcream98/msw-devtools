import { http, HttpResponse } from "msw"

const getRecipesRecipes = async () => {
  return http["get"]("https://api.sampleapis.com/recipes/recipes", () =>
    HttpResponse.json("this is aweesome!")
  )
}
const getSwitchGames = async () => {
  return http["get"]("https://api.sampleapis.com/switch/games", () =>
    HttpResponse.json("sample")
  )
}
const getWinesReds = async () => {
  return http["get"]("https://api.sampleapis.com/wines/reds", () =>
    HttpResponse.json("response 1")
  )
}

export const handlers = {
  getRecipesRecipes,
  getSwitchGames,
  getWinesReds
}
