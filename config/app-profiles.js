const apiBaseUrlOverride = typeof __API_BASE_URL__ === 'string'
  ? __API_BASE_URL__.trim().replace(/\/+$/, '')
  : ''

const profiles = {
  template: {
    code: 'template',
    name: '多端 App 模板',
    apiBaseUrl: 'https://api.example.com',
    themeColor: '#246bce'
  },
  a: {
    code: 'a',
    name: 'A 端 App',
    apiBaseUrl: 'https://a-api.example.com',
    themeColor: '#246bce'
  },
  b: {
    code: 'b',
    name: 'B 端 App',
    apiBaseUrl: 'https://b-api.example.com',
    themeColor: '#b45f06'
  },
  c: {
    code: 'c',
    name: 'C 端 App',
    apiBaseUrl: 'https://c-api.example.com',
    themeColor: '#2f855a'
  }
}

const buildCode = typeof __APP_CODE__ === 'string' ? __APP_CODE__ : 'template'

export const appProfile = profiles[buildCode] || profiles.template
export const appProfiles = Object.values(profiles)
export const apiBaseUrl = apiBaseUrlOverride || appProfile.apiBaseUrl

export function getAppProfile(code) {
  return profiles[code] || profiles.template
}
