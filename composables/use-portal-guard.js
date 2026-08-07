import { onMounted } from 'vue'
import { enforcePortal } from '../core/route-guard'

export function usePortalGuard(portal) {
  onMounted(() => enforcePortal(portal))
}
