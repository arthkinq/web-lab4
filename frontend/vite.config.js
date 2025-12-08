import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/weblab4/',

  build: {
    // 2. Куда складывать готовые файлы.
    // __dirname - это текущая папка (frontend). Мы выходим на уровень вверх (..)
    // и заходим в backend/src/main/webapp.
    outDir: path.resolve(__dirname, './backend/src/main/webapp'),

    // 3. НЕ очищать папку перед сборкой.
    // В папке webapp лежит папка WEB-INF с настройками Java (web.xml).
    // Если поставить true, Vite удалит твои настройки сервера!
    emptyOutDir: false,
  }
})
