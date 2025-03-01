import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Spending Tracker',
        short_name: 'SpendTrack',
        theme_color: '#3182CE',
        icons: [
          {
            src: '/icon-192.png.webp',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png.webp',
            type: 'image/png',
            sizes: '512x512'
          }
        ]
      }
    })
  ]
})