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
      config: {
        notifyRole: {
          name: 'Moderators',
        },
        notifyChannel: {
          name: 'spam-log',
        },
      },
    })
  }

  shouldExecute(msg) {
    return banWords.some(word =>
      msg.content.toLowerCase().includes(word.toLowerCase())
    )
  }

  run(msg) {
    const notifyRole = msg.guild.roles.find(
      role => role.name === this.config.notifyRole.name
    )
    const notifyChannel = msg.client.channels.find(
      channel => channel.name === this.config.notifyChannel.name
    )

    if (!notifyChannel)
      return console.warn(
        `WarnJob: Could not find channel with name ${this.config.notifyChannel.name}`
      )

    notifyChannel.send(
      `${notifyRole} Suspicious user: ${msg.author} in channel ${msg.channel}`
    )
  }
}
