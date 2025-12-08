import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/weblab4/',

  build: {
    outDir: path.resolve(__dirname, '../backend/src/main/webapp'),
    emptyOutDir: false,
  }
})
