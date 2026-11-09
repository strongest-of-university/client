import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.xn--939a144d.xn--hu5b25b77nvwc.xn--3e0b707e',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
