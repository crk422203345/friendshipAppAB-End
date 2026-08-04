import { PORTAL_AGENT, PORTAL_MERCHANT } from '../config/portals'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email) {
  if (!EMAIL_PATTERN.test(String(email || '').trim())) {
    throw new Error('请输入正确的邮箱地址')
  }
}

function validateCode(code) {
  if (!/^\d{6}$/.test(String(code || '').trim())) {
    throw new Error('请输入 6 位邮箱验证码')
  }
}

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), 360))
}

/**
 * 本地联调实现：接入后端时，仅替换本文件中的模拟请求。
 * 正式环境必须由服务端发送、校验邮箱验证码，并校验 portal 权限。
 */
export async function sendEmailCode({ email, purpose, portal }) {
  validateEmail(email)
  return delay({ email, purpose, portal, expiresIn: 60 })
}

export async function login({ email, password, code, loginType, portal }) {
  validateEmail(email)
  if (loginType === 'code') validateCode(code)
  if (loginType === 'password' && String(password || '').length < 6) {
    throw new Error('密码至少需要 6 位')
  }

  const selectedPortal = portal === PORTAL_AGENT ? PORTAL_AGENT : PORTAL_MERCHANT
  return delay({
    token: `demo-${selectedPortal}-${Date.now()}`,
    portal: selectedPortal,
    permissions: [`${selectedPortal}:home`],
    user: {
      id: `demo-${selectedPortal}`,
      name: selectedPortal === PORTAL_AGENT ? '张三' : '星云商贸',
      email: String(email).trim()
    }
  })
}

export async function registerAgent({ email, password, code }) {
  validateEmail(email)
  validateCode(code)
  if (String(password || '').length < 6) throw new Error('密码至少需要 6 位')
  return delay({ registered: true })
}

export async function resetPassword({ email, password, code }) {
  validateEmail(email)
  validateCode(code)
  if (String(password || '').length < 6) throw new Error('新密码至少需要 6 位')
  return delay({ reset: true })
}
