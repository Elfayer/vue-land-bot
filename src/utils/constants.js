const { NODE_ENV, OWNERS } = process.env

/*
  Bot owner(s) as specified in .env file.

  Permissions:

    - Running commands set as ownerOnly.
*/
const OWNER_IDS = OWNERS

/*
  Various important and or noteworthy user IDs.
*/
const USERS = {
  EVAN: '269617876036616193',
  GUSTO: '287377476647124992',
}

/*
  Various important and or noteworthy role IDs.
*/
const ROLES = {
  MVPS: '443314906050330635',
  CORE_TEAM: '361871508102053892',
  MODERATORS: '336317962522722316',
  COMMUNITY_LEADERS: '469085209187319808',
  LIBRARY_MAINTAINERS: '359877575738130432',
}

/*
  Bot developers IDS.

    - can enable/disable/list jobs
*/
const BOT_DEVELOPER_IDS = Object.freeze([
  '248017273950830593', // Elfayer
  '136620462821081088', // sustained
])

/*
  Protected users and roles.

    - moderation-related commands have no effect
*/
const PROTECTED_USER_IDS = Object.freeze([USERS.EVAN, USERS.GUSTO])
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
  Environment-specific adjustments, to make testing easier.

    PRODUCTION  - Live Vue Land server
    DEVELOPMENT - Vue Land Bot Testing server
*/
if (NODE_ENV === 'production') {
  // ...
} else {
  // ...
}

export {
  USERS,
  ROLES,
  PROTECTED_USER_IDS,
  PROTECTED_ROLE_IDS,
  MODERATOR_ROLE_IDS,
  OWNER_IDS,
  BOT_DEVELOPER_IDS,
  EMPTY_MESSAGE,
}
