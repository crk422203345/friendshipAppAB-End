export const PORTAL_AGENT = 'agent'
export const PORTAL_MERCHANT = 'merchant'

export const portals = {
  [PORTAL_AGENT]: {
    code: PORTAL_AGENT,
    name: '代理人端',
    loginTitle: '代理人登录',
    homePath: '/pages/agent/home',
    switchTo: PORTAL_MERCHANT,
    switchLabel: '切换至商家端登录',
    accent: '#5865f2',
    showRegister: true,
    showOtherLogin: true
  },
  [PORTAL_MERCHANT]: {
    code: PORTAL_MERCHANT,
    name: '商家端',
    loginTitle: '商家登录',
    homePath: '/pages/merchant/home',
    switchTo: PORTAL_AGENT,
    switchLabel: '切换至代理人端登录',
    accent: '#0f9d7a',
    showOnboarding: true
  }
}

export function getPortal(portal) {
  return portals[portal] || portals[PORTAL_MERCHANT]
}

export function getPortalHome(portal) {
  return getPortal(portal).homePath
}
