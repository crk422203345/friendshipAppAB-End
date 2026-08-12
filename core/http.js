import { apiBaseUrl } from '../config/app-profiles'
import { clearSession, session, updateSessionTokens } from './session'
import { getStorage, setStorage } from './storage'

let unauthorizedHandler = clearSession
const DEVICE_KEY = 'friendship-app-device'
let refreshPromise = null

export class HttpError extends Error {
  constructor(message, { statusCode = 0, data = null } = {}) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
    this.data = data
  }
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : clearSession
}

export function getDeviceHeaders() {
  const saved = getStorage(DEVICE_KEY, {})
  const id = saved.id || `app-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  let name = saved.name
  if (!name) {
    try {
      const system = uni.getSystemInfoSync()
      name = [system.brand, system.model].filter(Boolean).join(' ') || system.platform || 'uni-app'
    } catch {
      name = 'uni-app'
    }
  }
  setStorage(DEVICE_KEY, { id, name })
  return { 'X-Device-ID': id, 'X-Device-Name': name }
}

export async function refreshAccessToken(timeout = 15000) {
  if (!session.refreshToken) return false
  if (!refreshPromise) {
    refreshPromise = (async () => {
      let response
      try {
        response = await uni.request({
          url: `${apiBaseUrl}/api/v1/auth/token/refresh`,
          method: 'POST',
          data: JSON.stringify({ refresh_token: session.refreshToken }),
          header: { 'content-type': 'application/json', ...getDeviceHeaders() },
          timeout
        })
      } catch {
        return false
      }
      if (response.statusCode < 200 || response.statusCode >= 300) return false
      const payload = response.data?.data && typeof response.data.data === 'object' ? response.data.data : response.data || {}
      const token = payload.access_token || payload.accessToken || payload.token
      if (!token) return false
      const expiresIn = Number(payload.expires_in || payload.expiresIn || 0)
      updateSessionTokens({
        token,
        refreshToken: payload.refresh_token || payload.refreshToken || session.refreshToken,
        expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : 0
      })
      return true
    })().finally(() => { refreshPromise = null })
  }
  return refreshPromise
}

export function notifyUnauthorized() {
  unauthorizedHandler()
}

export async function http({
  url,
  method = 'GET',
  data,
  header = {},
  auth = true,
  retryOnUnauthorized = true,
  timeout = 15000
}) {
  if (!url) throw new HttpError('Request URL is required')

  const requestHeader = {
    'content-type': 'application/json',
    ...getDeviceHeaders(),
    ...header
  }

  if (auth && session.token) requestHeader.Authorization = `Bearer ${session.token}`

  const contentType = String(requestHeader['content-type'] || requestHeader['Content-Type'] || '').toLowerCase()
  const requestData = contentType.includes('application/json') && data && typeof data === 'object'
    ? JSON.stringify(data)
    : data

  let response
  try {
    response = await uni.request({
      url: url.startsWith('http') ? url : `${apiBaseUrl}${url}`,
      method,
      data: requestData,
      header: requestHeader,
      timeout
    })
  } catch (error) {
    throw new HttpError(error.errMsg || 'Network request failed')
  }

  if (response.statusCode === 401) {
    if (auth && retryOnUnauthorized && session.refreshToken && await refreshAccessToken(timeout)) {
      return http({ url, method, data, header, auth, retryOnUnauthorized: false, timeout })
    }
    if (auth) unauthorizedHandler()
    throw new HttpError(response.data?.error?.message || 'Unauthorized', response)
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new HttpError(response.data?.error?.message || response.data?.message || 'Request failed', response)
  }

  return response.data
}
