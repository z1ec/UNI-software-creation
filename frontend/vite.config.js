import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,           // Слушаем все сетевые интерфейсы
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true    // Важно для Docker на Windows/Mac
    }
  }
})