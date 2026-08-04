import { reactive, readonly } from 'vue'
import { getStorage, removeStorage, setStorage } from './storage'

const SESSION_KEY = 'app-template-session'

const state = reactive({
  token: '',
  user: null,
  hydrated: false
})

export const session = readonly(state)

export function hydrateSession() {
  const savedSession = getStorage(SESSION_KEY, {})
  state.token = savedSession.token || ''
  state.user = savedSession.user || null
  state.hydrated = true
}

export function setSession({ token, user }) {
  state.token = token || ''
  state.user = user || null
  setStorage(SESSION_KEY, {
    token: state.token,
    user: state.user
  })
}

export function clearSession() {
  state.token = ''
  state.user = null
  removeStorage(SESSION_KEY)
}
