import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Isso força o uso de caminhos relativos, ideal para GitHub Pages
})