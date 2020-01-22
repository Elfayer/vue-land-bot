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

export function inlineCode(input: string) {
  return '`' + input + '`'
}

export function command(command: string) {
  return inlineCode(`${PREFIX}${command}`)
}
