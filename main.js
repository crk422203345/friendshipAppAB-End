import { createSSRApp } from 'vue'
import uviewPro from 'uview-pro'
import App from './App'

export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPro)
  return { app }
}
