import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig(({ mode }) => ({
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
    __APP_CODE__: JSON.stringify(process.env.UNI_APP_CODE || 'template'),
    __VUE_PROD_DEVTOOLS__: false
  }
}))
