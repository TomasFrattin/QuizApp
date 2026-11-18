import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    allowedHosts: true // <-- Esto permite cualquier túnel sin tener que escribirlo cada vez
  }
})
