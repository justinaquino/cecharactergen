import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/cecharactergen/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'CE CharacterGen — Low-Tech Fantasy',
        short_name: 'CECharGen',
        description: 'Cepheus Engine Fantasy Character Generator',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        start_url: '/cecharactergen/',
        icons: [
          {
            src: '/cecharactergen/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/cecharactergen/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ],
})
