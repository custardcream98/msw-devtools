import react from "@vitejs/plugin-react"
import mswDevtools from "@custardcream/vite-plugin-msw-devtools"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), mswDevtools()]
})
