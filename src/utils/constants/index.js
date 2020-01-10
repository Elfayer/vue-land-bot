import { resolve } from 'path'

const { NODE_ENV = 'development' } = process.env
const IMPORT_FILE = `./${NODE_ENV}.js`

const { ROLES, OWNER_IDS, BOT_DEVELOPER_IDS } = require(IMPORT_FILE)

/*
  Various important and or noteworthy user IDs.
*/
const USERS = Object.freeze({
  BOT: '619109039166717972',
  EVAN: '269617876036616193',
  GUSTO: '287377476647124992',
  ELFAYER: '248017273950830593',
  SUSTAINED: '136620462821081088',
})

/*
  Protected user IDs.

    - moderation-related commands have no effect
*/
const PROTECTED_USER_IDS = Object.freeze([USERS.EVAN, USERS.GUSTO])

/*
  Protected roles.

    - moderation-related commands have no effect
*/

const PROTECTED_ROLE_IDS = Object.freeze([
  ROLES.CORE_TEAM,
  ROLES.MODERATORS,
  ROLES.COMMUNITY_LEADERS,
])

/*
  Moderators.

    - may use commands in the moderation command group
*/
const MODERATOR_ROLE_IDS = Object.freeze([ROLES.CORE_TEAM, ROLES.MODERATORS])

/*
  Used to send an embed-only message:

  Example:
  
    `channel.send(EMPTY_MESSAGE, { embed })`
*/
const EMPTY_MESSAGE = '\u200b'

/*
  Various paths.
*/

const DATA_DIR = resolve(__dirname, '../../../data')

/*
  Configuration relating to the messages utility.
*/
const AUTOMATICALLY_DELETE_ERRORS = true
const AUTOMATICALLY_DELETE_INVOCATIONS = true
const DELETE_ERRORS_AFTER_MS = 30000
const DELETE_INVOCATIONS_AFTER_MS = 15000

/*
  Discord API limits
*/
const DISCORD_EMBED_FIELD_LIMIT = 25
const DISCORD_EMBED_FIELD_NAME_LIMIT = 256
const DISCORD_EMBED_FIELD_VALUE_LIMIT = 1024
const DISCORD_EMBED_FOOTER_LIMIT = 2048
const DISCORD_EMBED_DESCRIPTION_LIMIT = 2048
const DISCORD_EMBED_AUTHOR_LIMIT = 256
const DISCORD_EMBED_TOTAL_LIMIT = 6000

/*
  The IDs of emojis that the bot will use in reactions, since bots have the 
  ability to use cross-server emojis without Discord Nitro.
*/
const EMOJIS = {
  PAGINATION: {
    PREV: '661289441184317441',
    NEXT: '661289441674919946',
    FIRST: '661289441171865660',
    LAST: '661289441218002984',
  },
  ENABLED: '661514135573495818',
  DISABLED: '661514135594467328',
}

EMOJIS.SUCCESS = EMOJIS.ENABLED
EMOJIS.FAILURE = EMOJIS.DISABLED

const TEST_GUILD = '617839535727968282'
const LIVE_GUILD = '325477692906536972'
let GUILDS = {
  TEST: TEST_GUILD,
  LIVE: LIVE_GUILD,
  CURRENT: process.env.NODE_ENV === 'production' ? LIVE_GUILD : TEST_GUILD,
}

const CDN_BASE_URL =
  'https://raw.githubusercontent.com/Elfayer/vue-land-bot/master/'

export {
  USERS,
  ROLES,
  GUILDS,
  EMOJIS,
  CDN_BASE_URL,
  OWNER_IDS,
  PROTECTED_USER_IDS,
  PROTECTED_ROLE_IDS,
  MODERATOR_ROLE_IDS,
  BOT_DEVELOPER_IDS,
  EMPTY_MESSAGE,
  DATA_DIR,
  AUTOMATICALLY_DELETE_ERRORS,
  AUTOMATICALLY_DELETE_INVOCATIONS,
  DELETE_ERRORS_AFTER_MS,
  DELETE_INVOCATIONS_AFTER_MS,
  DISCORD_EMBED_FIELD_LIMIT,
  DISCORD_EMBED_FIELD_NAME_LIMIT,
  DISCORD_EMBED_FIELD_VALUE_LIMIT,
  DISCORD_EMBED_FOOTER_LIMIT,
  DISCORD_EMBED_DESCRIPTION_LIMIT,
  DISCORD_EMBED_AUTHOR_LIMIT,
  DISCORD_EMBED_TOTAL_LIMIT,
}
