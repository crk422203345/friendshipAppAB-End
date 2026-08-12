import { reactive, readonly } from 'vue'
import { getStorage, removeStorage, setStorage } from './storage'

const SESSION_KEY = 'friendship-app-session'

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

export function hydrateSession() {
  const savedSession = getStorage(SESSION_KEY, {})
  state.token = savedSession.token || ''
  state.refreshToken = savedSession.refreshToken || ''
  state.user = savedSession.user || null
  state.portal = savedSession.portal || ''
  state.permissions = Array.isArray(savedSession.permissions) ? savedSession.permissions : []
  state.expiresAt = Number(savedSession.expiresAt) || 0
  state.hydrated = true
  if (state.token && state.expiresAt && state.expiresAt <= Date.now() && !state.refreshToken) clearSession()
}

export function setSession({ token, refreshToken = '', user, portal = '', permissions = [], expiresAt = 0 }) {
  state.token = token || ''
  state.refreshToken = refreshToken || ''
  state.user = user || null
  state.portal = portal || ''
  state.permissions = Array.isArray(permissions) ? permissions : []
  state.expiresAt = Number(expiresAt) || 0
  setStorage(SESSION_KEY, {
    token: state.token,
    refreshToken: state.refreshToken,
    user: state.user,
    portal: state.portal,
    permissions: state.permissions,
    expiresAt: state.expiresAt
  })
}

export function updateSessionUser(patch) {
  state.user = { ...(state.user || {}), ...patch }
  setStorage(SESSION_KEY, {
    token: state.token,
    refreshToken: state.refreshToken,
    user: state.user,
    portal: state.portal,
    permissions: state.permissions,
    expiresAt: state.expiresAt
  })
}

export function updateSessionTokens({ token, refreshToken = state.refreshToken, expiresAt = 0 }) {
  state.token = token || ''
  state.refreshToken = refreshToken || ''
  state.expiresAt = Number(expiresAt) || 0
  setStorage(SESSION_KEY, {
    token: state.token,
    refreshToken: state.refreshToken,
    user: state.user,
    portal: state.portal,
    permissions: state.permissions,
    expiresAt: state.expiresAt
  })
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
