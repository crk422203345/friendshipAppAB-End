export function normalizeAndValidateApiBaseUrl(value, { requireHttps = false } = {}) {
  const raw = String(value || '').trim()
  if (!raw) throw new Error('API base URL is not configured')

  let parsed
  try { parsed = new URL(raw) }
  catch { throw new Error('API base URL must be a valid HTTP(S) URL') }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('API base URL must use HTTP(S)')
  }
  if (requireHttps && parsed.protocol !== 'https:') {
    throw new Error('Production API base URL must use HTTPS')
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error('API base URL must not contain credentials, query parameters, or fragments')
  }

  return raw.replace(/\/+$/, '')
}
