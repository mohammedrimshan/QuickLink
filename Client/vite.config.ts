
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@hooks": "/src/hooks",
      "@utils": "/src/utils",
      "@assets": "/src/assets",
      "@context": "/src/context",
      "@styles": "/src/styles",
    },
  },
})