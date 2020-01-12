import { RichEmbed } from 'discord.js'
import Task from '../lib/task'
import moderation from '../services/moderation'
import { PROTECTED_ROLE_IDS, EMPTY_MESSAGE, GUILDS } from '../utils/constants'
import { blockCode, inlineCode } from '../utils/string'

/*
  In debug mode we don't *actually* ban even if a ban is triggered, additionally 
  we don't add any ignored roles, so that moderators etc. can test the command too.
*/
const DEBUG_MODE = process.env.NODE_ENV === 'development'

export default class ModerationTask extends Task {
  constructor(client) {
    super(client, {
      name: 'moderation',
      guild: GUILDS.CURRENT,
      description:
        'Takes action (warn, kick, ban, notify) when a user mention a trigger word.',
      enabled: true,
      ignored: {
        roles: DEBUG_MODE ? [] : [...PROTECTED_ROLE_IDS],
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
    // NOTE: Never remove this check.
    if (!super.shouldExecute(msg)) {
      return false
    }

    const match = moderation
      .get('triggers')
      .find(({ trigger }) => {
        return msg.content.toLowerCase().includes(trigger.toLowerCase())
      })
      .value()

    if (!match) {
      return false
    }

    this.action = match.action

    return true
  }

  run(msg) {
    const notifyRole = msg.guild.roles.find(
      role =>
        role.name.toLowerCase() === this.config.notifyRole.name.toLowerCase()
    )
    const logChannel = msg.guild.channels.find(
      channel =>
        channel.name.toLowerCase() === this.config.logChannel.name.toLowerCase()
    )

    if (!logChannel) {
      console.warn(
        `[ModerationTask]: Could not find channel with name ${this.config.logChannel.name}!`
      )
    }

    switch (this.action) {
      case 'warn':
        this.warn(msg, logChannel)
        break
      case 'kick':
        this.kick(msg, logChannel)
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
    const check = this.checkPermissionsFor(msg, logChannel, 'BAN_MEMBERS')

    if (check === false) {
      return
    } else if (check instanceof RichEmbed) {
      return this.log(msg, logChannel, { embed: check })
    }

    msg.member
      .ban(`[${msg.client.user.name}] Automated anti-spam measures.`)
      .then(() => this.log(msg, logChannel, { color: 'PURPLE' }))
      .catch(console.error)
  }

  kick(msg, logChannel) {
    const check = this.checkPermissionsFor(msg, logChannel, 'KICK_MEMBERS')

    if (check === false) {
      return
    } else if (check instanceof RichEmbed) {
      return this.log(msg, logChannel, { embed: check })
    }

    msg.member
      .kick(`[${msg.client.user.name}] Automated anti-spam measures.`)
      .then(() => this.log(msg, logChannel, { color: 'PURPLE' }))
      .catch(console.error)
  }

  permissionToAction(permission) {
    switch (permission) {
      case 'KICK_MEMBERS':
        return 'kick'
      case 'BAN_MEMBERS':
        return 'ban'
    }
  }

  checkPermissionsFor(msg, logChannel, permission) {
    const action = this.permissionToAction(permission)

    // Can't kick a user from a DM.
    if (msg.channel.type === 'dm') {
      return !!console.warn(
        `[ModerationTask] Cannot ${action} in a DM channel.`
      )
    }

    // We don't have permission to carry out the action - bail.
    if (!msg.channel.permissionsFor(msg.client.user).has(permission)) {
      console.warn(`[ModerationTask] Cannot ${action} - lacking permission.`)

      return this.createEmbed(msg, false, { color: 'PURPLE' }).addField(
        'NOTE',
        `No ${action} was enacted as I lack ${inlineCode(permission)}.`
      )
    }

    const botMember = msg.guild.member(msg.client.user)
    const botHighestRole = botMember.highestRole.calculatedPosition
    const userHighestRole = msg.member.highestRole.calculatedPosition

    // Our role is not high enough in the hierarchy to carry out the action - bail.
    if (botHighestRole < userHighestRole) {
      console.warn(`[ModerationTask] Cannot ${action} - role too low.`)

      return this.createEmbed(msg, false, { color: 'PURPLE' }).addField(
        'NOTE',
        `No ${action} was enacted as the user is higher than me in the role hierarchy.`
      )
    }

    if (DEBUG_MODE) {
      return this.createEmbed(msg, false, { color: 'RED' }).addField(
        'NOTE',
        `Debug mode is enabled - no ${action} was actually issued.`
      )
    }
  }

  async warn(msg, logChannel) {
    try {
      const dmChannel = await msg.author.createDM()
      this.log(msg, dmChannel, { color: 'ORANGE', isDMWarning: true })
      this.log(msg, logChannel, { color: 'ORANGE', isDMWarning: false })
    } catch (e) {
      console.error(e)
    }
  }

  notify(msg, logChannel, notifyRole) {
    this.log(msg, logChannel, { notifyRole })
  }

  log(msg, logChannel, options = {}) {
    if (typeof options.notifyRole === 'undefined') {
      options.notifyRole = EMPTY_MESSAGE
    }

    if (typeof options.isDMWarning === 'undefined') {
      options.isDMWarning = false
    }

    const embed =
      options.embed ||
      this.createEmbed(msg, options.isDMWarning, {
        color: 'ORANGE',
      })

    if (!logChannel) {
      return !!console.log(
        'Was going to semd the following embed, but no logChannel exists.',
        embed
      )
    }

    if (options.notifyRole) {
      logChannel.send(options.notifyRole, { embed })
    } else {
      logChannel.send(embed)
    }
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
