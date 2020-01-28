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

/**
 * Various noteworthy URLs.
 */
export const URLS = {
  COC: 'https://vuejs.org/coc',
  JSFIDDLE: 'https://jsfiddle.net/boilerplate/vue',
  CODESANDBOX: 'https://codesandbox.io/s/vue',
  CODEPEN: 'https://codepen.io/',
  GIST: 'https://gist.github.com/',
}

/**
 * Noteworthy roles.
 */
export const ROLES = Object.freeze(
  DEV
    ? {
        MVPS: '618043046055116801',
        CORE_TEAM: '618042877271867413',
        MODERATORS: '618042920028733461',
        COMMUNITY_LEADERS: '618042942871044117',
        LIBRARY_MAINTAINERS: '618043006506893322',
        NITRO_BOOSTERS: '630722169235832853',
        VUE_VIXENS: '630724481064632330',
        BOT_DEVELOPERS: '618503802995212309',
      }
    : {
        MVPS: '443314906050330635',
        CORE_TEAM: '361871508102053892',
        MODERATORS: '336317962522722316',
        COMMUNITY_LEADERS: '469085209187319808',
        LIBRARY_MAINTAINERS: '359877575738130432',
        NITRO_BOOSTERS: '585579626534010880',
        VUE_VIXENS: '504844406336258048',
        BOT_DEVELOPERS: '-1',
      }
)

/**
 * The default statuses. The bot will automatically cycle through them.
 */
export const STATUSES = [
  ['PLAYING', 'with the Composition API 💖'],
  ['PLAYING', 'with the the TypeScript nightly build'],
  ['PLAYING', 'with Webpack config files'],
  ['PLAYING', 'with fractals'],
  ['PLAYING', 'with natural language processing'],
  ['PLAYING', 'with machine learning'],
  ['PLAYING', 'games with Akryum'],
  ['LISTENING', 'to workout music with Dobromir 💪'],
  ['LISTENING', 'to dial-up modems 🎵'],
  ['LISTENING', 'to the gentle hum of the data center 🎵'],
  ['LISTENING', 'to gamma rays 🎵'],
  ['LISTENING', 'to algorithmic music 🎵'],
  ['LISTENING', 'to FullStack Radio 📻'],
  ['LISTENING', 'to Syntax FM 📻'],
  ['LISTENING', 'to CodePen Radio 📻'],
  ['LISTENING', 'to JavaScript Jabber 📻'],
  ['LISTENING', 'to Frontend Happy Hour 📻'],
  ['WATCHING', 'dotJS talks ⏯️'],
  ['WATCHING', 'JSConf talks ⏯️'],
  ['WATCHING', 'Frontend Love talks ⏯️'],
  ['WATCHING', 'YGLF talks ⏯️'],
  ['WATCHING', 'for spammers 👀'],
  ['WATCHING', 'for gusto tweets 👀'],
  ['WATCHING', 'for evan tweets 👀'],
  ['WATCHING', 'for Vue 3 announcements 👀'],
  ['WATCHING', 'anime with evan'],
  ['WATCHING', 'Macross 😎'],
  ['WATCHING', 'Level E 😎'],
  ['WATCHING', 'Kill la Kill 😎'],
  ['WATCHING', "JoJo's Bizarre Adventure 😎"],
  ['WATCHING', 'Evangelion 😎'],
  ['WATCHING', 'Dragon Ball 😎'],
  ['WATCHING', 'Cowboy Bebop 😎'],
  ['WATCHING', 'Blade Runner 😎'],
  ['WATCHING', 'Animatrix 😎'],
]
