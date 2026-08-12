import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig(({ mode }) => {
  const environment = { ...loadEnv(mode, process.cwd(), 'UNI_'), ...process.env }
  const apiBaseUrl = String(environment.UNI_API_BASE_URL || '').trim()

  if (mode === 'production' && !apiBaseUrl) {
    throw new Error('Production builds require UNI_API_BASE_URL. Configure it in the release environment.')
  }

  return {
  plugins: [uni()],
  build: {
    assetsInlineLimit: 1024,
    cssCodeSplit: true,
    minify: mode === 'production' ? 'terser' : false,
    sourcemap: false,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      format: {
        comments: false
      }
    }
  },
  define: {
    __APP_CODE__: JSON.stringify(environment.UNI_APP_CODE || 'template'),
    __API_BASE_URL__: JSON.stringify(apiBaseUrl),
    __VUE_PROD_DEVTOOLS__: false
  }
  }
})
