import { join, resolve } from 'path'

import { getVersion } from '@utilities/miscellaneous'

const BASE_PATH = resolve(__dirname, '../', '../')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

let version: string
try {
  version = getVersion()
} catch (error) {
  version = 'unknown'
  console.error(error)
}

/**
 * The name of the bot.
 */
export const NAME = process.env.NAME ?? 'VueBot'

/**
 * The version of the bot.
 */
export const VERSION = version

/**
 * The current language.
 */
export const LANGUAGE = process.env.LANGUAGE ?? 'en-US'

/**
 * The command prefix.
 */
export const PREFIX = process.env.PREFIX ?? '!'

/**
 * Are we in development or production?
 */
export const DEV = process.env.NODE_ENV === 'development'

/**
 * The snowflakes (IDs) of noteworthy guilds.
 */
export enum GUILDS {
  PRODUCTION = '325477692906536972', // Vue Land
  DEVELOPMENT = '617839535727968282', // Vue Land Bot Testing
}

/**
 * Various noteworthy paths.
 */
export const PATHS = {
  BASE: BASE_PATH,
  DATA: join(BASE_PATH, 'data'),
  JSON: join(BASE_PATH, 'data', 'providers', 'json'),
  ASSETS: join(BASE_PATH, 'assets'),
  IMAGES: join(BASE_PATH, 'assets', 'images'),
  ICONS: join(BASE_PATH, 'assets', 'images', 'icons'),
}
