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

export {
  USERS,
  ROLES,
  OWNER_IDS,
  PROTECTED_USER_IDS,
  PROTECTED_ROLE_IDS,
  MODERATOR_ROLE_IDS,
  BOT_DEVELOPER_IDS,
  EMPTY_MESSAGE,
}
