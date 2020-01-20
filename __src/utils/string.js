export function inlineCode(code) {
  return '`' + code + '`'
}

export function blockCode(code, syntax = '') {
  return '```' + syntax + '\n' + code + '\n```'
}

/**
 * Add an ellipsis to the end of a string.
 *
 * @param {string} str The input string.
 * @param {number} maxLength The maximum length to allow.
 * @return {string} The ellips-ised string.
 */
export function addEllipsis(input, maxLength) {
  if (input.length < maxLength) {
    return input
  }

  return input.substr(0, maxLength - 1) + '…'
}
