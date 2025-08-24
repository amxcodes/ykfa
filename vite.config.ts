import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa'; // DISABLED - causing loading issues

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // PWA DISABLED to fix browser loading issues
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
    //   manifest: {
    //     name: "Yaseen's YKFA Timer",
    //     short_name: 'YKFA Timer',
    //     description: 'Premium Gym & Karate Fitness Academy Timer',
    //     theme_color: '#1a1a1a',
    //     background_color: '#1a1a1a',
    //     display: 'standalone',
    //     icons: [
    //       {
    //         src: 'pwa-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       }
    //     ]
    //   },
    //   workbox: {
    //     disableDevLogs: true,
    //   },
    //   devOptions: {
    //     enabled: false,
    //     type: 'module',
    //     navigateFallback: 'index.html',
    //   },
    // })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion'],
        },
      },
    },
  },
});
