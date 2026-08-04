export function getRuntimeInfo() {
  const system = uni.getSystemInfoSync()
  const info = {
    platform: system.platform,
    system: system.system,
    appVersion: '',
    appVersionCode: ''
  }

  // #ifdef APP-PLUS
  info.appVersion = plus.runtime.version
  info.appVersionCode = plus.runtime.versionCode
  // #endif

  return info
}

export async function checkForUpdate(checker) {
  if (typeof checker !== 'function') return { available: false }
  return checker(getRuntimeInfo())
}
