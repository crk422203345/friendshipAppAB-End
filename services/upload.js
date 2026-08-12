import { apiBaseUrl } from '../config/app-profiles'
import { HttpError, getDeviceHeaders, notifyUnauthorized, refreshAccessToken } from '../core/http'
import { session } from '../core/session'

export async function uploadFile({
  filePath,
  name = 'file',
  formData = {},
  header = {},
  url = '/uploads',
  auth = true,
  timeout = 30000,
  retryOnUnauthorized = true
}) {
  if (!filePath) throw new Error('filePath is required')

  const requestHeader = { ...getDeviceHeaders(), ...header }
  if (auth && session.token) requestHeader.Authorization = `Bearer ${session.token}`

  let response
  try {
    response = await uni.uploadFile({
      url: url.startsWith('http') ? url : `${apiBaseUrl}${url}`,
      filePath,
      name,
      formData,
      header: requestHeader,
      timeout
    })
  } catch (error) {
    throw new HttpError(error.errMsg || 'File upload failed')
  }

  let payload = response.data
  try { payload = JSON.parse(response.data) } catch { /* 非 JSON 响应按原文返回。 */ }

  if (response.statusCode === 401) {
    if (auth && retryOnUnauthorized && session.refreshToken && await refreshAccessToken(timeout)) {
      return uploadFile({ filePath, name, formData, header, url, auth, timeout, retryOnUnauthorized: false })
    }
    if (auth) notifyUnauthorized()
    throw new HttpError(payload?.error?.message || 'Unauthorized', { statusCode: response.statusCode, data: payload })
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new HttpError(payload?.error?.message || payload?.message || 'File upload failed', { statusCode: response.statusCode, data: payload })
  }

  return payload
}
