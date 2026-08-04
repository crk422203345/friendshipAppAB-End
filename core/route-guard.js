import { getPortalHome, PORTAL_AGENT, PORTAL_MERCHANT } from '../config/portals'
import { session } from './session'

export function enforcePortal(requiredPortal) {
  if (!session.token) {
    uni.reLaunch({ url: `/pages/auth/login?portal=${requiredPortal || PORTAL_MERCHANT}` })
    return false
  }

  if (requiredPortal && session.portal !== requiredPortal) {
    uni.showToast({ title: '当前账号无权访问此页面', icon: 'none' })
    uni.reLaunch({ url: getPortalHome(session.portal) })
    return false
  }

  return true
}

export function isPortalPath(path, portal) {
  if (portal === PORTAL_AGENT) return path.startsWith('/pages/agent/')
  if (portal === PORTAL_MERCHANT) return path.startsWith('/pages/merchant/')
  return false
}
