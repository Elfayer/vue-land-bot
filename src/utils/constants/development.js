/*
  Various important and or noteworthy role IDs.
*/
export const ROLES = Object.freeze({
  MVPS: '618043046055116801',
  CORE_TEAM: '618042877271867413',
  MODERATORS: '618042920028733461',
  COMMUNITY_LEADERS: '618042942871044117',
  LIBRARY_MAINTAINERS: '618043006506893322',
  NITRO_BOOSTERS: '630722169235832853',
  VUE_VIXENS: '630724481064632330',
  BOT_DEVELOPERS: '618503802995212309',
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
export const OWNER_IDS = Object.freeze(BOT_DEVELOPER_IDS)
