import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        name: 'CWS Transactions',
        short_name: 'Cws Transactions',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: './RwacofLogoCoulRVB.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
    }),
    react(),
  ],
  server: {
    host: '0.0.0.0',
  },
});
