const { NODE_ENV } = process.env

/*
  Import user IDs.
*/
const USERS = {
  EVAN: "269617876036616193",
  GUSTO: "287377476647124992"
}

/*
  Important role IDs.
*/
const ROLES = {
  MVPS: "443314906050330635",
  CORE_TEAM: "361871508102053892",
  MODERATORS: "336317962522722316",
  COMMUNITY_LEADERS: "469085209187319808",
  LIBRARY_MAINTAINERS: "359877575738130432"
}

/*
  Moderation-related commands etc. will not effect these users.
*/
let PROTECTED_USER_IDS = [
  USER_EVAN,
  USER_GUSTO
];

/*
  Moderation-related commands etc. will not effect these roles.
*/
let PROTECTED_ROLE_IDS = [
  CORE_TEAM,
  MODERATORS,
  COMMUNITY_LEADERS
];

/*
  Users with these roles can use moderation-related commands.

  Of course the Discord permission hierarchy still applies.
*/
let MODERATOR_ROLE_IDS = [
  CORE_TEAM,
  MODERATORS
];

/*
  Environment-specific adjustments, to make testing easier.

  PRODUCTION  - Live Vue Land server
  DEVELOPMENT - Vue Land Bot Testing server
*/
if (NODE_ENV === 'production') {

}
else {

}

export {
  USERS,
  ROLES,
  PROTECTED_USER_IDS,
  PROTECTED_ROLE_IDS,
  MODERATOR_ROLE_IDS
}
