/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  server: {
    port: 4200,
    host: 'localhost',
    open: true,
    watch: {
      usePolling: true,
    }
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  plugins: [react()],
});