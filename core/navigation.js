export function resolvePageUrl(target) {
  if (typeof target === 'string') return target.trim()
  if (target && typeof target.path === 'string') return target.path.trim()
  return ''
}

export function openPage(target) {
  const url = resolvePageUrl(target)
  if (!url || !url.startsWith('/pages/')) {
    uni.showToast({ title: '页面地址无效', icon: 'none' })
    return false
  }

  uni.navigateTo({
    url,
    fail: (error) => {
      if (!String(error?.errMsg || '').includes('cancel')) {
        uni.showToast({ title: '页面打开失败', icon: 'none' })
      }
    }
  })
  return true
}
