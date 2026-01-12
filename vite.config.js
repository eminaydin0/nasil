import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  },
  server: {
    port: 3050,
    strictPort: false, // Port kullanımdaysa otamatik değiştir
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
})
