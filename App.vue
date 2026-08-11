<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { setUnauthorizedHandler } from './core/http'
import { clearSession, hydrateSession } from './core/session'

let redirectingToLogin = false

onLaunch(() => {
  hydrateSession()
  setUnauthorizedHandler(() => {
    clearSession()
    if (redirectingToLogin) return
    redirectingToLogin = true
    uni.reLaunch({
      url: '/pages/auth/login',
      complete: () => setTimeout(() => { redirectingToLogin = false }, 300)
    })
  })
})
</script>

<style lang="scss">
@import 'uview-pro/index.scss';
@import './static/iconfont/iconfont.css';

page {
  min-height: 100%;
  background: #f7f8fc;
  color: #172033;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button::after {
  border: 0;
}
</style>
