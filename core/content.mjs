const HTML_ENTITIES = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
  '#39': "'"
}

export function decodeBasicHtmlEntities(value) {
  return String(value || '').replace(/&(?:amp|apos|gt|lt|nbsp|quot|#39);/gi, (entity) => {
    const key = entity.slice(1, -1).toLowerCase()
    return HTML_ENTITIES[key] ?? entity
  })
}

export function toPlainText(value) {
  return decodeBasicHtmlEntities(String(value || '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '• ')
    .replace(/\*\*|__/g, '')
    .replace(/\n{3,}/g, '\n\n'))
    .trim()
}
