import levenshtein from 'js-levenshtein'

export function uppercaseFirst(string) {
  return string.substr(0, 1).toUpperCase() + string.substr(1)
}

/**
 * Find the distance/difference between two strings (between 0 and 1).
 *
 * Examples:
 *
 *  dog <-> dog     = 1.0
 *  dog <-> dogs    = 0.75
 *  dog <-> doggy   = 0.6
 *  dog <-> doggies = 0.42
 *
 * @param {string} a The 1st input string.
 * @param {string} b The 2nd input string.
 */
export function distanceBetween(a, b) {
  const maxLength = Math.max(a.length, b.length)

  return ((levenshtein(a, b) - maxLength) * 1) / (0 - maxLength)
}
