const { NODE_ENV = 'development' } = process.env

const IMPORT_FILE = `./${NODE_ENV}.js`

const {
  USERS,
  ROLES,
  OWNER_IDS,
  BOT_DEVELOPER_IDS,
  PROTECTED_USER_IDS,
} = require(IMPORT_FILE)

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
  Discord API limits
*/
const DISCORD_EMBED_FIELD_LIMIT = 25
const DISCORD_EMBED_FIELD_NAME_LIMIT = 256
const DISCORD_EMBED_FIELD_VALUE_LIMIT = 1024
const DISCORD_EMBED_FOOTER_LIMIT = 2048
const DISCORD_EMBED_AUTHOR_LIMIT = 256
const DISCORD_EMBED_TOTAL_LIMIT = 6000

export {
  USERS,
  ROLES,
  OWNER_IDS,
  PROTECTED_USER_IDS,
  PROTECTED_ROLE_IDS,
  MODERATOR_ROLE_IDS,
  BOT_DEVELOPER_IDS,
  EMPTY_MESSAGE,
  DISCORD_EMBED_FIELD_LIMIT,
  DISCORD_EMBED_FIELD_NAME_LIMIT,
  DISCORD_EMBED_FIELD_VALUE_LIMIT,
  DISCORD_EMBED_FOOTER_LIMIT,
  DISCORD_EMBED_AUTHOR_LIMIT,
  DISCORD_EMBED_TOTAL_LIMIT,
}
