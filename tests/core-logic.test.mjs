import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { normalizeAndValidateApiBaseUrl } from '../core/api-base-url.mjs'
import { toPlainText } from '../core/content.mjs'
import { parseInvitationCode } from '../core/invitation.mjs'
import { createLatestTask } from '../core/latest-task.mjs'
import { requireAuthorizedPortal } from '../core/login-portal.mjs'
import { isSameApiTarget, resolveRequestUrl } from '../core/request-url.mjs'

test('invitation codes support path, query and raw formats', () => {
  assert.equal(parseInvitationCode('https://example.com/i/AG000001'), 'AG000001')
  assert.equal(parseInvitationCode('https://example.com/join?inviteCode=ABC_123'), 'ABC_123')
  assert.equal(parseInvitationCode('ABC-123'), 'ABC-123')
  assert.equal(parseInvitationCode('javascript:alert(1)'), '')
})

test('authenticated URLs cannot leave the configured API target', () => {
  assert.equal(resolveRequestUrl('https://api.example.com/', '/api/v1/me'), 'https://api.example.com/api/v1/me')
  assert.equal(resolveRequestUrl('https://api.example.com', 'api/v1/me'), 'https://api.example.com/api/v1/me')
  assert.throws(() => resolveRequestUrl('https://api.example.com', 'https://evil.example/me'), /configured API/)
  assert.equal(resolveRequestUrl('https://api.example.com', 'https://public.example/config', { allowExternal: true }), 'https://public.example/config')
  assert.equal(isSameApiTarget('https://api.example.com', 'https://api.example.com/api/v1/me'), true)
  assert.equal(isSameApiTarget('https://api.example.com', 'https://api.example.com.evil.test/me'), false)
})

test('rich content is converted to safe readable text', () => {
  assert.equal(toPlainText('<p>Hello &amp; welcome</p><script>alert(1)</script><br>- item'), 'Hello & welcome\n\n• item')
})

test('latest task invalidates stale async results', () => {
  const task = createLatestTask()
  const first = task.begin()
  const second = task.begin()
  assert.equal(task.isCurrent(first), false)
  assert.equal(task.isCurrent(second), true)
  task.invalidate()
  assert.equal(task.isCurrent(second), false)
})

test('production API base URLs require safe HTTPS endpoints', () => {
  assert.equal(normalizeAndValidateApiBaseUrl('https://api.example.com/', { requireHttps: true }), 'https://api.example.com')
  assert.throws(() => normalizeAndValidateApiBaseUrl('http://api.example.com', { requireHttps: true }), /HTTPS/)
  assert.throws(() => normalizeAndValidateApiBaseUrl('https://user:pass@api.example.com'), /credentials/)
  assert.throws(() => normalizeAndValidateApiBaseUrl('https://api.example.com?target=test'), /query/)
})

test('login portal authorization fails closed', () => {
  assert.equal(requireAuthorizedPortal({ portal: 'agent' }, 'agent'), 'agent')
  assert.equal(requireAuthorizedPortal({ roles: ['merchant', 'agent'] }, 'agent'), 'agent')
  assert.equal(requireAuthorizedPortal({ account: { agent: { agent_no: 'AG000001' } } }, 'agent'), 'agent')
  assert.throws(() => requireAuthorizedPortal({}, 'agent'), /无权登录/)
  assert.throws(() => requireAuthorizedPortal({ portal: 'merchant' }, 'agent'), /无权登录/)
})

test('merchant scan uses the shared invitation parser', async () => {
  const source = await readFile(new URL('../pages/auth/merchant-scan.vue', import.meta.url), 'utf8')
  assert.match(source, /parseInvitationCode\(result\)/)
  assert.doesNotMatch(source, /parseInviteCode\(result\)/)
})
