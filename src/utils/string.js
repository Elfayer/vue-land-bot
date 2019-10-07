export function inlineCode(code) {
  return '`' + code + '`'
}

export function blockCode(code, syntax = '') {
  return '```' + syntax + '\n' + code + '\n```'
}
