const VALID_PORTALS = new Set(['agent', 'merchant'])

function portalCandidates(payload = {}) {
  const account = payload.account && typeof payload.account === 'object' ? payload.account : {}
  const user = account.user && typeof account.user === 'object' ? account.user : (payload.user || {})
  const agent = account.agent && typeof account.agent === 'object' ? account.agent : (payload.agent || {})
  const merchant = account.merchant && typeof account.merchant === 'object' ? account.merchant : (payload.merchant || {})
  const candidates = [payload.portal, payload.role, account.portal, account.role, user.portal, user.role, agent.portal, agent.role]
  const collections = [payload.portals, payload.roles, account.portals, account.roles]

  for (const collection of collections) {
    if (Array.isArray(collection)) candidates.push(...collection)
  }
  if (agent && typeof agent === 'object' && Object.keys(agent).length) candidates.push('agent')
  if (merchant && typeof merchant === 'object' && Object.keys(merchant).length) candidates.push('merchant')
  return candidates
    .map((value) => typeof value === 'string' ? value.trim().toLowerCase() : '')
    .filter((value) => VALID_PORTALS.has(value))
}

export function requireAuthorizedPortal(payload, requestedPortal) {
  if (!VALID_PORTALS.has(requestedPortal)) throw new Error('登录端类型无效')
  if (!portalCandidates(payload).includes(requestedPortal)) {
    throw new Error('当前账号无权登录所选端')
  }
  return requestedPortal
}
