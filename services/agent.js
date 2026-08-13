import { http } from '../core/http'

function queryString(query = {}) {
  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  return params.length ? `?${params.join('&')}` : ''
}

export function unwrap(response) {
  return response?.data && typeof response.data === 'object' ? response.data : response
}

export function listOf(response) {
  const payload = unwrap(response)
  if (Array.isArray(payload)) return payload
  const candidate = payload?.items ?? payload?.list ?? payload?.records
  return Array.isArray(candidate) ? candidate : []
}

export function getDashboard() {
  return http({ url: '/api/v1/dashboard' })
}

export function getCurrentAccount() {
  return http({ url: '/api/v1/me' })
}

export function getAnnouncements(query) {
  return http({ url: `/api/v1/announcements${queryString(query)}` })
}

export function getAnnouncement(id) {
  return http({ url: `/api/v1/announcements/${encodeURIComponent(id)}` })
}

export function getNotificationUnreadCount() {
  return http({ url: '/api/v1/notifications/unread-count' })
}

export function getNotifications(query) {
  return http({ url: `/api/v1/notifications${queryString(query)}` })
}

export function markNotificationRead(id) {
  return http({ url: `/api/v1/notifications/${encodeURIComponent(id)}/read`, method: 'PUT' })
}

export function markAllNotificationsRead() {
  return http({ url: '/api/v1/notifications/read-all', method: 'PUT' })
}

export function getMerchantInvitation() {
  return http({ url: '/api/v1/merchant-invitations/current' })
}

export function refreshMerchantInvitation() {
  return http({ url: '/api/v1/merchant-invitations/refresh', method: 'POST' })
}

export function reportMerchantInvitationEvent(data, idempotencyKey) {
  return http({
    url: '/api/v1/merchant-invitations/events',
    method: 'POST',
    data,
    header: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}
  })
}

export function getMerchants(query) {
  return http({ url: `/api/v1/merchants${queryString(query)}` })
}

export function getMerchant(id) {
  return http({ url: `/api/v1/merchants/${encodeURIComponent(id)}` })
}

export function getMerchantContract(id) {
  return http({ url: `/api/v1/merchants/${encodeURIComponent(id)}/contract` })
}

export function requestMerchantRestore(id, data, idempotencyKey) {
  return http({
    url: `/api/v1/merchants/${encodeURIComponent(id)}/restore-requests`,
    method: 'POST',
    data,
    header: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}
  })
}

export function getCommissionSummary() {
  return http({ url: '/api/v1/commissions/summary' })
}

export function getCommissionMonths(limit = 12) {
  return http({ url: `/api/v1/commission-months${queryString({ limit })}` })
}

export function getLedger(query) {
  return http({ url: `/api/v1/ledger${queryString(query)}` })
}

export function getBankCards() {
  return http({ url: '/api/v1/bank-cards' })
}

export function deleteBankCard(id) {
  return http({ url: `/api/v1/bank-cards/${encodeURIComponent(id)}`, method: 'DELETE' })
}

export function setDefaultBankCard(id) {
  return http({ url: `/api/v1/bank-cards/${encodeURIComponent(id)}/default`, method: 'PUT' })
}

export function getWithdrawalPolicy() {
  return http({ url: '/api/v1/withdrawals/policy' })
}

export function createWithdrawal(data, idempotencyKey) {
  return http({
    url: '/api/v1/withdrawals',
    method: 'POST',
    data,
    header: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}
  })
}

export function getFaqs(query) {
  return http({ url: `/api/v1/faqs${queryString(query)}` })
}

export function getContentArticle(articleNo) {
  return http({ url: `/api/v1/content/articles/${encodeURIComponent(articleNo)}` })
}

export function getPlatformRules(query) {
  return http({ url: `/api/v1/platform-rules${queryString(query)}` })
}

export function getTutorials(query) {
  return http({ url: `/api/v1/tutorials${queryString(query)}` })
}

export function getAppConfig() {
  return http({ url: '/api/v1/app-config', auth: false })
}

export function getPromotionMaterials(query) {
  return http({ url: `/api/v1/promotion-materials${queryString(query)}` })
}

export function getPromotionMaterial(id) {
  return http({ url: `/api/v1/promotion-materials/${encodeURIComponent(id)}` })
}

export function reportPromotionMaterialEvent(id, data, idempotencyKey) {
  return http({
    url: `/api/v1/promotion-materials/${encodeURIComponent(id)}/events`,
    method: 'POST',
    data,
    header: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}
  })
}
