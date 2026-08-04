import { appProfile } from '../config/app-profiles'

export async function uploadFile({
  filePath,
  name = 'file',
  formData = {},
  header = {},
  url = '/uploads'
}) {
  if (!filePath) throw new Error('filePath is required')

  const response = await uni.uploadFile({
    url: url.startsWith('http') ? url : `${appProfile.apiBaseUrl}${url}`,
    filePath,
    name,
    formData,
    header
  })

  try {
    return JSON.parse(response.data)
  } catch {
    return response.data
  }
}
