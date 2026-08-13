import { apiBaseUrl } from '../config/app-profiles'
import { HttpError, getDeviceHeaders, getResponseErrorMessage, notifyUnauthorized, refreshAccessToken } from '../core/http'
import { session } from '../core/session'
import { isSameApiTarget, resolveRequestUrl } from '../core/request-url.mjs'

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

  let requestUrl
  try { requestUrl = resolveRequestUrl(apiBaseUrl, url, { allowExternal: !auth }) }
  catch (error) { throw new HttpError(error.message || 'Invalid upload URL') }

  const requestHeader = { ...(isSameApiTarget(apiBaseUrl, requestUrl) ? getDeviceHeaders() : {}), ...header }
  const requestToken = auth ? session.token : ''
  if (auth && requestToken) requestHeader.Authorization = `Bearer ${requestToken}`

  let response
  try {
    response = await uni.uploadFile({
      url: requestUrl,
      filePath,
      name,
      formData,
      header: requestHeader,
      timeout
    })
  } catch (error) {
    throw new HttpError(error?.errMsg || error?.message || 'File upload failed')
  }

  let payload = response.data
  try { payload = JSON.parse(response.data) } catch { /* 非 JSON 响应按原文返回。 */ }

  if (response.statusCode === 401) {
    if (auth && retryOnUnauthorized && session.token && session.token !== requestToken) {
      return uploadFile({ filePath, name, formData, header, url, auth, timeout, retryOnUnauthorized: false })
    }
    if (auth && retryOnUnauthorized && session.refreshToken && await refreshAccessToken(timeout)) {
      return uploadFile({ filePath, name, formData, header, url, auth, timeout, retryOnUnauthorized: false })
    }
    if (auth && (!session.token || session.token === requestToken)) notifyUnauthorized()
    throw new HttpError(getResponseErrorMessage(payload, 'Unauthorized'), { statusCode: response.statusCode, data: payload })
  }

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new HttpError(getResponseErrorMessage(payload, 'File upload failed'), { statusCode: response.statusCode, data: payload })
  }

  return payload
}
