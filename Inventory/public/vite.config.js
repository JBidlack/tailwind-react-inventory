import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ASSET_URL = process.env.ASSET_URL;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3030,
  },
  preview: {
    port: 8000,
  },
  base: `/`,
  plugins: [react()],
})
