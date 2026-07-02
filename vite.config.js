import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { localApiPlugin } from './vite-plugin-local-api.mjs';

dotenv.config();

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 3060,
    strictPort: true,
    host: true,
    hmr: {
      host: 'localhost',
      port: 3060,
      clientPort: 3060,
    },
    headers: {
      'Service-Worker-Allowed': '/',
    },
  },
});
