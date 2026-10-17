import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: false,
    host: true
  },
  publicDir: 'public',
  build: {
    target: 'esnext',
    assetsInlineLimit: 0,
    outDir: 'dist'
  }
});
