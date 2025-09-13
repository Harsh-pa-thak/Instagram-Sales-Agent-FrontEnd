import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,  // Allow all hosts
    port: Number(process.env.PORT) || 3000,
    allowedHosts: ['instagram-sales-agent-frontend.onrender.com']
  }
})
