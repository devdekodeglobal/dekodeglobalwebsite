import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { localApiPlugin } from './scripts/vite-local-api.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    plugins: [react(), localApiPlugin()],
  }
})
