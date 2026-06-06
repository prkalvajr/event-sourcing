import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes all asset paths relative, so the app works whether it is
// served from a domain root or a GitHub Pages project subpath (/repo-name/).
export default defineConfig({
  base: './',
  plugins: [react()],
})
