const { OWNERS } = process.env

/*
  Various important and or noteworthy user IDs.
*/
export const USERS = Object.freeze({
  EVAN: '269617876036616193',
  GUSTO: '287377476647124992',
  ELFAYER: '248017273950830593',
  SUSTAINED: '136620462821081088',
})

/*
  Various important and or noteworthy role IDs.
*/
export const ROLES = Object.freeze({
  MVPS: '443314906050330635',
  CORE_TEAM: '361871508102053892',
  MODERATORS: '336317962522722316',
  COMMUNITY_LEADERS: '469085209187319808',
  LIBRARY_MAINTAINERS: '359877575738130432',
})

/*
  Bot developers IDS.

    - can enable/disable/list jobs
*/
export const BOT_DEVELOPER_IDS = Object.freeze([
  '248017273950830593', // Elfayer
  '136620462821081088', // sustained
])

/*
  Bot owner(s)

    PRODUCTION  - gusto, evan
    DEVELOPMENT - elfayer, sustained

    - can run commands set as ownerOnly
*/
export const OWNER_IDS = Object.freeze(OWNERS)

/*
  Protected roles.

    - moderation-related commands have no effect
*/
export const PROTECTED_USER_IDS = Object.freeze([USERS.EVAN, USERS.GUSTO])
