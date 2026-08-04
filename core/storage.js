export function getStorage(key, fallback = null) {
  try {
    const value = uni.getStorageSync(key)
    return value === '' || value === undefined ? fallback : value
  } catch {
    return fallback
  }
}

export function setStorage(key, value) {
  uni.setStorageSync(key, value)
}

export function removeStorage(key) {
  uni.removeStorageSync(key)
}
