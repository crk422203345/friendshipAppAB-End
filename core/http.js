import { apiBaseUrl } from '../config/app-profiles'
import { clearSession, session, updateSessionTokens } from './session'
import { getStorage, setStorage } from './storage'
import { isSameApiTarget, resolveRequestUrl } from './request-url.mjs'

let unauthorizedHandler = clearSession
const DEVICE_KEY = 'friendship-app-device'
let refreshPromise = null
let refreshingToken = ''

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

export function getResponseErrorMessage(payload, fallback) {
  if (typeof payload === 'string' && payload.trim()) return payload.trim()
  const message = payload?.error?.message || payload?.error?.msg || payload?.message || payload?.msg
  return typeof message === 'string' && message.trim() ? message.trim() : fallback
}

export function getDeviceHeaders() {
  const stored = getStorage(DEVICE_KEY, {})
  const saved = stored && typeof stored === 'object' ? stored : {}
  if (saved?.id && saved?.name) return { 'X-Device-ID': saved.id, 'X-Device-Name': saved.name }
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
  const refreshToken = session.refreshToken
  if (!refreshToken) return false
  if (refreshPromise && refreshingToken === refreshToken) return refreshPromise

  const currentPromise = (async () => {
    let response
    try {
      response = await uni.request({
        url: `${apiBaseUrl}/api/v1/auth/token/refresh`,
        method: 'POST',
        data: JSON.stringify({ refresh_token: refreshToken }),
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
    if (session.refreshToken !== refreshToken) return false
    const expiresIn = Number(payload.expires_in || payload.expiresIn || 0)
    updateSessionTokens({
      token,
      refreshToken: payload.refresh_token || payload.refreshToken || refreshToken,
      expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : 0
    })
    return true
  })()

  refreshPromise = currentPromise
  refreshingToken = refreshToken
  try {
    return await currentPromise
  } finally {
    if (refreshPromise === currentPromise) {
      refreshPromise = null
      refreshingToken = ''
    }
  }
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
  let requestUrl
  try { requestUrl = resolveRequestUrl(apiBaseUrl, url, { allowExternal: !auth }) }
  catch (error) { throw new HttpError(error.message || 'Invalid request URL') }

  const requestToken = auth ? session.token : ''

  const requestHeader = {
    'content-type': 'application/json',
    ...(isSameApiTarget(apiBaseUrl, requestUrl) ? getDeviceHeaders() : {}),
    ...header
  }

  if (auth && requestToken) requestHeader.Authorization = `Bearer ${requestToken}`

  const contentType = String(requestHeader['content-type'] || requestHeader['Content-Type'] || '').toLowerCase()
  const requestData = contentType.includes('application/json') && data && typeof data === 'object'
    ? JSON.stringify(data)
    : data

  let response
  try {
    response = await uni.request({
      url: requestUrl,
      method,
      data: requestData,
      header: requestHeader,
      timeout
    })
  } catch (error) {
    throw new HttpError(error?.errMsg || error?.message || 'Network request failed')
  }

  if (response.statusCode === 401) {
    if (auth && retryOnUnauthorized && session.token && session.token !== requestToken) {
      return http({ url, method, data, header, auth, retryOnUnauthorized: false, timeout })
    }
    if (auth && retryOnUnauthorized && session.refreshToken && await refreshAccessToken(timeout)) {
      return http({ url, method, data, header, auth, retryOnUnauthorized: false, timeout })
    }
    if (auth && (!session.token || session.token === requestToken)) unauthorizedHandler()
    throw new HttpError(getResponseErrorMessage(response.data, 'Unauthorized'), response)
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new HttpError(getResponseErrorMessage(response.data, 'Request failed'), response)
  }

  return response.data
}
