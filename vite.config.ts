import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: '/times-tables/',
  build: {
    outDir: 'dist',
    // Generate sourcemaps for debugging
    sourcemap: true,
  },
  server: {
    // Open browser on dev server start
    open: true,
  },
})
