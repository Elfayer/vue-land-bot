import { RichEmbed } from 'discord.js'
import Task from '../lib/task'
import moderation from '../services/moderation'
import {
  MODERATOR_ROLE_IDS,
  PROTECTED_ROLE_IDS,
  EMPTY_MESSAGE,
} from '../utils/constants'
import { blockCode } from '../utils/string'

// Don't *actually* ban - real bans make testing hard!
const DEBUG_MODE = process.env.NODE_ENV === 'development'

export default class BanTask extends Task {
  constructor(client) {
    super(client, {
      name: 'ban',
      description: 'Auto-ban users who mention a "ban" trigger word.',
      enabled: true,
      ignored: {
        roles: [...new Set(MODERATOR_ROLE_IDS.concat(PROTECTED_ROLE_IDS))],
      },
      guildOnly: true,
      config: {
        logChannel: {
          name: 'moderation',
        },
      },
    })
  }

  shouldExecute(msg) {
    // None of the ban words were mentioned - bail.
    if (
      !moderation
        .get('triggers')
        .filter(({ action }) => action === 'ban')
        .some(({ trigger }) => {
          return msg.content.toLowerCase().includes(trigger.toLowerCase())
        })
        .value()
    ) {
      return false
    }

    // We don't have permission to ban - bail.
    if (!msg.channel.permissionsFor(msg.client.user).has('BAN_MEMBERS')) {
      return !!console.warn('[BanTask] Cannot ban - lacking permission.')
    }

    const botMember = msg.guild.member(msg.client.user)
    const botHighestRole = botMember.highestRole.calculatedPosition
    const userHighestRole = msg.member.highestRole.calculatedPosition

    // Our role is not high enough in the hierarchy to ban - bail.
    if (botHighestRole < userHighestRole) {
      return !!console.warn('[BanTask] Cannot ban - role too low.')
    }

    return true
  }

  run(msg) {
    const logChannel = msg.client.channels.find(
      channel => channel.name === this.config.logChannel.name
    )

    if (!logChannel) {
      return console.warn(
        `[BanTask]: Could not find channel with name ${this.config.logChannel.name}`
      )
    }

    if (DEBUG_MODE) {
      return this.log(msg, logChannel)
    }

    msg.member
      .ban(`[${msg.client.user.name}] Automated anti-spam measures.`)
      .then(() => this.log(msg, logChannel))
      .catch(console.error) // Shouldn't happen due to shouldExecute checks but...
  }

  log(msg, logChannel) {
    const excerpt =
      msg.cleanContent.length > 150
        ? msg.cleanContent.substring(0, 150) + '...'
        : msg.cleanContent

    if (!logChannel) {
      return console.info(
        `Banned user: ${msg.author}`,
        `Due to message:`,
        msg.cleanContent
      )
    }

    const embed = new RichEmbed()
    embed
      .setTitle('Moderation - Ban Notice')
      .setColor('RED')
      .setDescription('Found one or more trigger words with action: `ban`.')
      .addField('User', msg.member, true)
      .addField('Channel', msg.channel, true)
      .setTimestamp()
      .addField('Message Excerpt', blockCode(excerpt))

    if (DEBUG_MODE) {
      embed.addField('NOTE', 'Debug mode enabled - no ban was actually issued.')
    }

    logChannel.send(EMPTY_MESSAGE, { embed })
  }
}
