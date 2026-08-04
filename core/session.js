import { reactive, readonly } from 'vue'
import { getStorage, removeStorage, setStorage } from './storage'

const SESSION_KEY = 'friendship-app-session'

const state = reactive({
  token: '',
  user: null,
  portal: '',
  permissions: [],
  hydrated: false
})

export const session = readonly(state)

export function hydrateSession() {
  const savedSession = getStorage(SESSION_KEY, {})
  state.token = savedSession.token || ''
  state.user = savedSession.user || null
  state.portal = savedSession.portal || ''
  state.permissions = Array.isArray(savedSession.permissions) ? savedSession.permissions : []
  state.hydrated = true
}

export function setSession({ token, user, portal = '', permissions = [] }) {
  state.token = token || ''
  state.user = user || null
  state.portal = portal || ''
  state.permissions = Array.isArray(permissions) ? permissions : []
  setStorage(SESSION_KEY, {
    token: state.token,
    user: state.user,
    portal: state.portal,
    permissions: state.permissions
  })
}

export function clearSession() {
  state.token = ''
  state.user = null
  state.portal = ''
  state.permissions = []
  removeStorage(SESSION_KEY)
}
