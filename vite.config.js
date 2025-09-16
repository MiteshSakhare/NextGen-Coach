import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('🔧 Vite Config - Loading environment variables:')
  console.log('   Mode:', mode)
  console.log('   VITE_GEMINI_API_KEY:', env.VITE_GEMINI_API_KEY ? 'FOUND' : 'MISSING')
  
  return {
    plugins: [react()],
    base: './',
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['framer-motion', 'lucide-react']
          }
        }
      }
    },
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'NextGen Coach'),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'https://generativelanguage.googleapis.com')
    },
    envDir: './',
    envPrefix: 'VITE_'
  }
})
