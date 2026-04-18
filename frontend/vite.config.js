import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      host: '0.0.0.0',
      port: 3000
    },
    base: process.env.VITE_BASE_URL || '/',
    plugins: [react()],
  }
})
