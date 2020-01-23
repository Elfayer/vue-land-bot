import { execSync } from 'child_process'
import { oneLine } from 'common-tags'
import { PREFIX } from '../constants'

/**
 * Return the current tag, branch or commit - whichever is found first.
 */
export function getVersion() {
  return execSync(oneLine`
    git describe --tags --exact-match 2> /dev/null ||
    git symbolic-ref -q --short HEAD ||
    git rev-parse --short HEAD
  `)
    .toString('utf8')
    .trim()
}

/**
 * Turn a role ID into a role mention.
 */
export function roleMention(roleId: string) {
  return `<@&${roleId}>`
}

/**
 * Wrap a string in backticks.
 */
export function inlineCode(input: string) {
  return '`' + input + '`'
}

/**
 * Add the command prefix to a string, and optionally wrap it in backticks.
 *
 * Primarily used for command usage examples in extended help sections.
 */
export function command(command: string, wrap = false) {
  return wrap ? inlineCode(`${PREFIX}${command}`) : `${PREFIX}${command}`
}

/**
 * Shorten a string, if necessary.
 */
// FIXME: Would be nice if it wouldn't split in the middle of Markdown links.
export function excerpt(input: string, length: number = 63) {
  if (input.length <= length) {
    return input
  }

  return input.substring(0, length) + '…'
}
