import { RichEmbed } from 'discord.js'
import Task from '../lib/task'
import moderation from '../services/moderation'
import {
  MODERATOR_ROLE_IDS,
  PROTECTED_ROLE_IDS,
  EMPTY_MESSAGE,
} from '../utils/constants'
import { blockCode, inlineCode } from '../utils/string'

// Don't *actually* ban - real bans make testing hard!
const DEBUG_MODE = process.env.NODE_ENV === 'development'

export default class ModerationTask extends Task {
  constructor(client) {
    super(client, {
      name: 'moderation',
      description:
        'Takes action (warn, ban, notify) when users mention a trigger word.',
      enabled: true,
      ignored: {
        roles: [...new Set(MODERATOR_ROLE_IDS.concat(PROTECTED_ROLE_IDS))],
      },
      guildOnly: true,
      config: {
        logChannel: {
          name: 'moderation',
        },
        notifyRole: {
          name: 'Moderators',
        },
      },
    })

    this.action = null // ban | warn | notify
  }

  shouldExecute(msg) {
    const match = moderation
      .get('triggers')
      .find(({ trigger }) => {
        return msg.content.toLowerCase().includes(trigger.toLowerCase())
      })
      .value()

    if (!match) {
      return true
    }

    console.log(`Message is ${msg.cleanContent}`)
    console.log(`Action to take is ${match.action}`, match)
    this.action = match.action
  }

  run(msg) {
    const notifyRole = msg.guild.roles.find(
      role => role.name === this.config.notifyRole.name
    )
    const logChannel = msg.client.channels.find(
      channel => channel.name === this.config.logChannel.name
    )

    if (!logChannel) {
      return console.warn(
        `[ModerationTask]: Could not find channel with name ${this.config.logChannel.name}!`
      )
    }

    switch (this.action) {
      case 'warn':
        this.warn(msg, logChannel)
        break
      case 'ban':
        this.ban(msg, logChannel)
        break
      case 'notify':
      default:
        this.notify(msg, logChannel, notifyRole)
        break
    }
  }

  ban(msg, logChannel) {
    // Can't ban a user from a DM.
    if (msg.channel.type === 'dm') {
      return !!console.warn('[ModerationTask] Cannot ban in a DM channel.')
    }

    // We don't have permission to ban - bail.
    if (!msg.channel.permissionsFor(msg.client.user).has('BAN_MEMBERS')) {
      return !!console.warn('[ModerationTask] Cannot ban - lacking permission.')
    }

    const botMember = msg.guild.member(msg.client.user)
    const botHighestRole = botMember.highestRole.calculatedPosition
    const userHighestRole = msg.member.highestRole.calculatedPosition

    // Our role is not high enough in the hierarchy to ban - bail.
    if (botHighestRole < userHighestRole) {
      return !!console.warn('[BanTask] Cannot ban - role too low.')
    }

    if (DEBUG_MODE) {
      const embed = this.createEmbed(msg, false, { color: 'RED' }).addField(
        'NOTE',
        'Debug mode enabled - no ban was actually issued.'
      )
      return this.log(msg, logChannel, { embed })
    }

    msg.member
      .ban(`[${msg.client.user.name}] Automated anti-spam measures.`)
      .then(() => this.log(msg, logChannel))
      .catch(console.error)
  }

  async warn(msg, logChannel) {
    try {
      const dmChannel = await msg.author.createDM()
      this.log(msg, dmChannel, { color: 'ORANGE', isDMWarning: true })
      this.log(msg, logChannel, { color: 'ORANGE' })
    } catch (e) {
      console.error(e)
    }
  }

  notify(msg, logChannel, notifyRole) {
    this.log(msg, logChannel, { notifyRole })
  }

  log(msg, logChannel, options = {}) {
    logChannel.send(options.notifyRole || EMPTY_MESSAGE, {
      embed:
        options.embed ||
        this.createEmbed(msg, options.isDMWarning || false, {
          color: 'ORANGE',
        }),
    })
  }

  createEmbed(msg, isDMWarning = false, options = {}) {
    const excerpt =
      msg.cleanContent.length > 150
        ? msg.cleanContent.substring(0, 150) + '...'
        : msg.cleanContent

    const embed = new RichEmbed()
      .setTitle(`Moderation - ${options.title || this.action}`)
      .setColor(options.color || 'RANDOM')
      .setTimestamp()
      .addField('Message Excerpt', blockCode(excerpt))

    if (isDMWarning) {
      embed.setDescription(
        'One of your messages triggered auto-moderation. Repeated infringements may result in a ban.'
      )
    } else {
      embed
        .setDescription(
          `Found one or more trigger words with action: ${inlineCode(
            this.action
          )}.`
        )
        .addField('User', msg.member, true)
        .addField('Channel', msg.channel, true)
        .addField('Action Taken', inlineCode(this.action), true)
    }

    return embed
  }
}
