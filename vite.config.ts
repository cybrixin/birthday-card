import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.join(path.resolve(__dirname, 'src')) },
    ],
  },
  build: {
    outDir: "build"
  },
  envPrefix: "PUBLIC_"
})
