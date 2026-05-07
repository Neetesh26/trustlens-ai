import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        id: "/",
        name: 'SecureTrack App',
        short_name: 'SecureTrack',
        description: 'Track lost devices securely',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',

        icons: [
  {
    src: "https://unsplash.com/photos/neon-signs-glow-brightly-on-a-building-at-night-6ByLB9U5MOY",
    sizes: "512x512",
    type: "image/png"
  },
  {
    src: "https://unsplash.com/photos/neon-signs-glow-brightly-on-a-building-at-night-6ByLB9U5MOY",
    sizes: "192x192",
    type: "image/png"
  }
],

        screenshots: [
          {
            src: "/screenshots/desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/screenshots/mobile.png",
            sizes: "390x844",
            type: "image/png"
          }
        ]
      }
    })
  ]
})