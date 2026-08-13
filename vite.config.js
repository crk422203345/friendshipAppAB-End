import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { normalizeAndValidateApiBaseUrl } from './core/api-base-url.mjs'

export default defineConfig(({ mode }) => {
  const environmentMode = process.env.UNI_BUILD_MODE || mode
  const fileEnvironment = loadEnv(environmentMode, process.cwd(), 'UNI_')
  const environment = { ...fileEnvironment, ...process.env }
  const isProduction = environmentMode === 'production' || mode === 'production' || environment.NODE_ENV === 'production'
  const configuredApiBaseUrl = isProduction ? process.env.UNI_API_BASE_URL : environment.UNI_API_BASE_URL
  let apiBaseUrl = ''
  if (configuredApiBaseUrl) apiBaseUrl = normalizeAndValidateApiBaseUrl(configuredApiBaseUrl, { requireHttps: isProduction })
  else if (isProduction) throw new Error('Production builds require an explicit UNI_API_BASE_URL environment variable.')

  return {
    plugins: [uni()],
    build: {
      assetsInlineLimit: 1024,
      cssCodeSplit: true,
      minify: isProduction ? 'terser' : false,
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
