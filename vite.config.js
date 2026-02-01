import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '', // Deixar vazio ou usar './' força o Vite a usar caminhos relativos
})