import Task from '../lib/task'
import { ROLES, GUILDS } from '../utils/constants'

export default class BetaTask extends Task {
  constructor(client) {
    super(client, {
      name: 'beta',
      description:
        'Only allow specific roles to interact with the bot on the (live) server during the beta period.',
      enabled: true,
      guildOnly: false,
      config: {
        guild: GUILDS.LIVE,
        allowedRoles: Object.values(ROLES),
        allowDMs: true,
      },
    })
  }

  inhibit(msg) {
    const { allowDMs, allowedRoles } = this.config

    if (msg.guild && msg.guild.id === this.config.guild) {
      if (!msg.member.roles.some(role => allowedRoles.includes(role.id))) {
        return 'beta-restriction'
      }
    } else {
      if (!allowDMs) {
        return 'beta-restriction'
      }
    }
  }
}
