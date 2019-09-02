import Job from '../lib/job'
import { MODERATOR_ROLE_IDS, PROTECTED_ROLE_IDS } from '../utils/constants'

export default class WarnJob extends Job {
  constructor(client) {
    super(client, {
      name: 'warn',
      description: 'Rules to warn Moderators',
      enabled: false,
      ignored: {
        roles: [...MODERATOR_ROLE_IDS, ...PROTECTED_ROLE_IDS],
      },
      guildOnly: true,
    })
  }

  run(msg) {
    const notifyRole = msg.guild.roles.find(role => role.name === 'Admin')
    const notifyChannel = msg.client.channels.find(
      channel => channel.name === 'spam'
    )

    notifyChannel.send(
      `${notifyRole} Suspicious user: ${msg.author} in channel ${msg.channel}`
    )
  }
}
