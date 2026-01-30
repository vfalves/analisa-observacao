import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/analisa-observacao/', // Verifique se as barras e o nome estão corretos
})