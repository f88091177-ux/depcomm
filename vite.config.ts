import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement depuis .env ou le système
  // Utilisation de process.cwd() avec cast pour éviter les erreurs TS strictes
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Injection sécurisée : si la clé est absente, on injecte une chaîne vide "" au lieu de undefined
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Polyfill de process.env pour éviter le crash "process is not defined"
      'process.env': {}
    },
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('recharts')) {
                return 'vendor-charts';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('@google/genai')) {
                return 'vendor-genai';
              }
              return 'vendor-utils';
            }
          }
        }
      }
    }
  }
})