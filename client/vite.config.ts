import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    outDir: 'dist', // Output directory for production build
  },
  server: {
    port: 5173, // Development server port
  },
})