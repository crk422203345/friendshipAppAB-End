import { appProfile } from '../config/app-profiles'
import { clearSession, session } from './session'

let unauthorizedHandler = clearSession

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

export async function http({
  url,
  method = 'GET',
  data,
  header = {},
  timeout = 15000
}) {
  if (!url) throw new HttpError('Request URL is required')

  const requestHeader = {
    'content-type': 'application/json',
    ...header
  }

  if (session.token) requestHeader.Authorization = `Bearer ${session.token}`

  let response
  try {
    response = await uni.request({
      url: url.startsWith('http') ? url : `${appProfile.apiBaseUrl}${url}`,
      method,
      data,
      header: requestHeader,
      timeout
    })
  } catch (error) {
    throw new HttpError(error.errMsg || 'Network request failed')
  }

  if (response.statusCode === 401) {
    unauthorizedHandler()
    throw new HttpError('Unauthorized', response)
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new HttpError('Request failed', response)
  }

  return response.data
}
