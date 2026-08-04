<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { hydrateSession } from './core/session'

onLaunch(() => {
  hydrateSession()
})
</script>

<style lang="scss">
@import 'uview-pro/index.scss';

page {
  min-height: 100%;
  background: #f4f6f8;
  color: #1e2933;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button::after {
  border: 0;
}
</style>
