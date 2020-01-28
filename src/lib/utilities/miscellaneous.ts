import { execSync } from 'child_process'

import { KlasaGuild } from 'klasa'
import { oneLine } from 'common-tags'

import { PREFIX } from '@libraries/constants'
import { I18nKey } from '@libraries/types/I18n'
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
 * Wrap a string in single backticks.
 */
export function inlineCode(input: string) {
  return '`' + input + '`'
}

/**
 * Wrap a string in triple backticks.
 */
export function blockCode(input: string, language: string = '') {
  return '```' + (language ?? '') + '\n' + input + '\n```'
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

/**
 * Warn a guild owner about something.
 *
 * @param guild The guild.
 * @param key A valid i18n key.
 * @param params Params to pass to i18n.
 */
export function warnOwner(guild: KlasaGuild, key: I18nKey, params: any[]) {
  return guild?.owner
    ?.createDM()
    .then(dm => dm.sendMessage(guild.language.get(key, ...params)))
    .catch(console.error)
}
