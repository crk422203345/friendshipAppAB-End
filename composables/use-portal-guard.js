import { onLoad } from '@dcloudio/uni-app'
import { enforcePortal } from '../core/route-guard'

export function usePortalGuard(portal) {
  onLoad(() => enforcePortal(portal))
}
