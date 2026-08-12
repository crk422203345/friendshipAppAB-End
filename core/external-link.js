export function normalizeExternalUrl(value) {
  const url = String(value || '').trim()
  return /^https?:\/\//i.test(url) ? url : ''
}

export function openExternalUrl(value) {
  const url = normalizeExternalUrl(value)
  if (!url) return false

  if (typeof plus !== 'undefined' && plus.runtime?.openURL) {
    plus.runtime.openURL(url)
    return true
  }

  if (typeof window !== 'undefined' && typeof window.open === 'function') {
    window.open(url, '_blank', 'noopener,noreferrer')
    return true
  }

  uni.setClipboardData({
    data: url,
    success: () => uni.showToast({ title: '链接已复制，请在浏览器中打开', icon: 'none' })
  })
  return true
}
