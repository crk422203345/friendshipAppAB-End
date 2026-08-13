import { onLoad } from '@dcloudio/uni-app'
import { enforcePortal } from '../core/route-guard'

export function usePortalGuard(portal, onAllowed) {
  onLoad((options) => {
    if (!enforcePortal(portal)) return
    if (typeof onAllowed === 'function') onAllowed(options)
  })
}
