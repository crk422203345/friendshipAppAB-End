import { reactive, readonly } from 'vue'
import { getStorage, removeStorage, setStorage } from './storage'

const SESSION_KEY = 'friendship-app-session'
const VALID_PORTALS = new Set(['agent', 'merchant'])

const state = reactive({
  token: '',
  refreshToken: '',
  user: null,
  portal: '',
  permissions: [],
  expiresAt: 0,
  hydrated: false
})

export const session = readonly(state)

function normalizePortal(value) {
  return VALID_PORTALS.has(value) ? value : ''
}

function persistSession() {
  setStorage(SESSION_KEY, {
    token: state.token,
    refreshToken: state.refreshToken,
    user: state.user,
    portal: state.portal,
    permissions: state.permissions,
    expiresAt: state.expiresAt
  })
}

export function hydrateSession() {
  const stored = getStorage(SESSION_KEY, {})
  const savedSession = stored && typeof stored === 'object' ? stored : {}
  state.token = savedSession.token || ''
  state.refreshToken = savedSession.refreshToken || ''
  state.user = savedSession.user || null
  state.portal = normalizePortal(savedSession.portal)
  state.permissions = Array.isArray(savedSession.permissions) ? savedSession.permissions : []
  state.expiresAt = Number(savedSession.expiresAt) || 0
  state.hydrated = true
  if ((state.token && !state.portal) || (state.token && state.expiresAt && state.expiresAt <= Date.now() && !state.refreshToken)) clearSession()
}

export function setSession({ token, refreshToken = '', user, portal = '', permissions = [], expiresAt = 0 }) {
  state.token = token || ''
  state.refreshToken = refreshToken || ''
  state.user = user || null
  state.portal = normalizePortal(portal)
  state.permissions = Array.isArray(permissions) ? permissions : []
  state.expiresAt = Number(expiresAt) || 0
  if (!state.token || !state.portal) { clearSession(); return false }
  persistSession()
  return true
}

export function updateSessionUser(patch) {
  if (!patch || typeof patch !== 'object') return
  state.user = { ...(state.user || {}), ...patch }
  persistSession()
}

export function updateSessionTokens({ token, refreshToken = state.refreshToken, expiresAt = 0 }) {
  state.token = token || ''
  state.refreshToken = refreshToken || ''
  state.expiresAt = Number(expiresAt) || 0
  persistSession()
}

export function clearSession() {
  state.token = ''
  state.refreshToken = ''
  state.user = null
  state.portal = ''
  state.permissions = []
  state.expiresAt = 0
  removeStorage(SESSION_KEY)
}
