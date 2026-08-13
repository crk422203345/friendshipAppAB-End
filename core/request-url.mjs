export function isAbsoluteHttpUrl(value) {
  return /^https?:\/\//i.test(String(value || '').trim())
}

export function normalizeApiBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '')
}

export function isSameApiTarget(baseUrl, value) {
  const base = normalizeApiBaseUrl(baseUrl)
  const target = String(value || '').trim()
  return Boolean(base) && (target === base || target.startsWith(`${base}/`))
}

export function resolveRequestUrl(baseUrl, value, { allowExternal = false } = {}) {
  const base = normalizeApiBaseUrl(baseUrl)
  const target = String(value || '').trim()
  if (!target) throw new Error('Request URL is required')

  if (isAbsoluteHttpUrl(target)) {
    if (!allowExternal && !isSameApiTarget(base, target)) {
      throw new Error('Authenticated requests must target the configured API origin')
    }
    return target
  }

  if (!base) throw new Error('API base URL is not configured')
  return `${base}${target.startsWith('/') ? '' : '/'}${target}`
}
