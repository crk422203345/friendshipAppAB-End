const featurePermissions = {
  camera: 'scope.camera',
  album: 'scope.writePhotosAlbum',
  location: 'scope.userLocation',
  notification: 'scope.subscribeMessage'
}

export function getFeaturePermission(feature) {
  return featurePermissions[feature] || ''
}

export async function requestFeaturePermission(feature) {
  const permission = getFeaturePermission(feature)
  if (!permission) throw new Error(`Unknown permission feature: ${feature}`)

  // #ifdef MP-WEIXIN
  try {
    await uni.authorize({ scope: permission })
    return { feature, granted: true }
  } catch {
    return { feature, granted: false }
  }
  // #endif

  // #ifdef APP-PLUS
  return { feature, granted: false, requiresNativeAdapter: true }
  // #endif

  return { feature, granted: false }
}
