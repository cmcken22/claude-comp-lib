// Bundles the dashboard (React + the component library) into one IIFE script
// and one stylesheet, so it can be served as a static page.
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: fileURLToPath(new URL('./src/main.tsx', import.meta.url)),
      formats: ['iife'],
      name: 'ConstructionDashboard',
      fileName: () => 'app.js',
      cssFileName: 'app',
    },
  },
});
