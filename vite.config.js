// this is config for the local dev-server frontend

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  plugins: [react()],

  // this allows ~ paths, whcih also needs to be enabled on esbuild for backend (if you want that)
  resolve: {
    alias: {
      '~': resolve(fileURLToPath(new URL('.', import.meta.url)), './src')
    }
  },

  // thse are URLs that need to be passed to backend
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        ws: true
      }
    }
  },

  // don't warn on big chunks
  build: {
    chunkSizeWarningLimit: 40000000
  }
})
