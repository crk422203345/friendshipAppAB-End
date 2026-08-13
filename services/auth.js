import { PORTAL_AGENT, PORTAL_MERCHANT } from '../config/portals'
import { http } from '../core/http'
import { requireAuthorizedPortal } from '../core/login-portal.mjs'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const codeScenes = {
  login: 'login',
  register: 'register',
  'reset-password': 'password_reset'
}

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

function unwrap(response) {
  return response?.data && typeof response.data === 'object' ? response.data : response
}

function normalizeLogin(response, portal, email) {
  const payload = unwrap(response) || {}
  const token = payload.access_token || payload.accessToken || payload.token
  if (!token) throw new Error('登录接口未返回 access_token')

  const account = payload.account || {}
  const accountUser = account.user || payload.user || {}
  const agent = account.agent || payload.agent || null
  const user = agent
    ? {
        ...accountUser,
        ...agent,
        agentId: agent.agent_no || agent.agentNo || '',
        avatar: agent.avatar_url || agent.avatarUrl || agent.avatar || '',
        email: agent.email || accountUser.email || accountUser.username || String(email).trim()
      }
    : Object.keys(accountUser).length
      ? accountUser
      : { email: String(email).trim() }
  const expiresIn = Number(payload.expires_in || payload.expiresIn || 0)
  const authorizedPortal = requireAuthorizedPortal(payload, portal)
  return {
    token,
    refreshToken: payload.refresh_token || payload.refreshToken || '',
    portal: authorizedPortal,
    permissions: Array.isArray(payload.permissions || accountUser.permissions) ? (payload.permissions || accountUser.permissions) : [],
    expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : 0,
    user
  }
}

export async function sendEmailCode({ email, purpose, portal }) {
  validateEmail(email)
  const selectedPortal = portal === PORTAL_AGENT || portal === PORTAL_MERCHANT ? portal : ''
  return http({
    url: '/api/v1/auth/codes',
    method: 'POST',
    auth: false,
    data: {
      target: String(email).trim(),
      scene: codeScenes[purpose] || purpose,
      ...(selectedPortal ? { portal: selectedPortal } : {})
    }
  })
}

export async function login({ email, password, code, loginType, portal }) {
  const account = String(email || '').trim()
  if (loginType === 'code') {
    validateEmail(account)
    validateCode(code)
  } else if (!account) {
    throw new Error('请输入账号')
  }
  if (loginType === 'password' && String(password || '').length < 6) {
    throw new Error('密码至少需要 6 位')
  }

  const selectedPortal = portal === PORTAL_AGENT ? PORTAL_AGENT : PORTAL_MERCHANT
  const response = await http({
    url: loginType === 'code' ? '/api/v1/auth/login/code' : '/api/v1/auth/login',
    method: 'POST',
    data: loginType === 'code'
      ? { target: account, code, portal: selectedPortal }
      : { username: account, password, portal: selectedPortal },
    auth: false
  })
  return normalizeLogin(response, selectedPortal, account)
}

export async function registerAgent({ email, password, code }) {
  validateEmail(email)
  validateCode(code)
  validateNewPassword(password)
  return http({
    url: '/api/v1/auth/register',
    method: 'POST',
    auth: false,
    data: { email: String(email).trim(), password, code, portal: PORTAL_AGENT }
  })
}

export async function resetPassword({ email, password, code }) {
  validateEmail(email)
  validateCode(code)
  validateNewPassword(password)
  return http({
    url: '/api/v1/auth/password/reset',
    method: 'POST',
    auth: false,
    data: { target: String(email).trim(), code, new_password: password }
  })
}

export async function changeCurrentPassword({ email, password, code }) {
  validateEmail(email)
  validateCode(code)
  validateNewPassword(password)
  return http({
    url: '/api/v1/me/password',
    method: 'PUT',
    data: { target: String(email).trim(), code, new_password: password }
  })
}

function validateNewPassword(password) {
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,20}$/.test(String(password || ''))) {
    throw new Error('密码需为 8—20 位并同时包含字母和数字')
  }
}

export function logout() {
  return http({ url: '/api/v1/auth/logout', method: 'POST' })
}
