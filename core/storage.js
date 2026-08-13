export function getStorage(key, fallback = null) {
  try {
    const value = uni.getStorageSync(key)
    return value === '' || value === undefined ? fallback : value
  } catch {
    return fallback
  }
}

export function setStorage(key, value) {
  try {
    uni.setStorageSync(key, value)
    return true
  } catch {
    return false
  }
}

export function removeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch {
    return false
  }
}
