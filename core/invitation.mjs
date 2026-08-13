export function parseInvitationCode(value) {
  const raw = String(value || '').trim()
  if (!raw) return ''
  const match = raw.match(/[?&](?:inviteCode|invitationNo|code)=([^&#]+)/i)
    || raw.match(/\/i\/([^/?#]+)/i)
  let code = raw
  try {
    if (match) code = decodeURIComponent(match[1])
  } catch {
    return ''
  }
  return /^[A-Za-z0-9_-]{6,128}$/.test(code) ? code : ''
}
