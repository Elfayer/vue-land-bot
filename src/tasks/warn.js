import { RichEmbed } from 'discord.js'
import Task from '../lib/task'
import {
  EMPTY_MESSAGE,
  MODERATOR_ROLE_IDS,
  PROTECTED_ROLE_IDS,
} from '../utils/constants'
import { blockCode } from '../utils/string'
import moderation from '../services/moderation'

export default class WarnTask extends Task {
  constructor(client) {
    super(client, {
      name: 'warn',
      description:
        'Auto-warn moderators when users mention a "warn" trigger word.',
      enabled: true,
      ignored: {
        roles: [...new Set(MODERATOR_ROLE_IDS.concat(PROTECTED_ROLE_IDS))],
      },
      guildOnly: true,
      config: {
        notifyRole: {
          name: 'Moderators',
        },
        notifyChannel: {
          name: 'moderation',
        },
      },
    })
  }

  shouldExecute(msg) {
    return moderation
      .get('triggers')
      .filter(({ action }) => action === 'warn')
      .some(({ trigger }) => {
        return msg.content.toLowerCase().includes(trigger.toLowerCase())
      })
      .value()
  }

  run(msg) {
    const notifyRole = msg.guild.roles.find(
      role => role.name === this.config.notifyRole.name
    )
    const notifyChannel = msg.client.channels.find(
      channel => channel.name === this.config.notifyChannel.name
    )

    if (!notifyChannel) {
      return console.warn(
        `[WarnTask] Could not find channel with name ${this.config.notifyChannel.name}`
      )
    }

    const excerpt =
      msg.cleanContent.length > 150
        ? msg.cleanContent.substring(0, 150) + '...'
        : msg.cleanContent

    const embed = new RichEmbed()
    embed
      .setTitle('Moderation - Auto-warning')
      .setColor('ORANGE')
      .setDescription('Found one or more trigger words with action: `warn`.')
      .addField('User', msg.member, true)
      .addField('Channel', msg.channel, true)
      .setTimestamp()
      .addField('Message Excerpt', blockCode(excerpt))

    notifyChannel.send(notifyRole ? notifyRole : EMPTY_MESSAGE, { embed })
  }
}
