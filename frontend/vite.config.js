import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // When VITE_API_URL is unset, the app uses same-origin `/api/...` and this forwards to Express.
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
})
