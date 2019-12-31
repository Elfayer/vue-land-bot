import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  EMPTY_MESSAGE,
  OWNER_IDS,
  BOT_DEVELOPER_IDS,
  MODERATOR_ROLE_IDS,
} from '../../utils/constants'
import { inlineCode, blockCode } from '../../utils/string'

const ALLOWED_ROLES = [...MODERATOR_ROLE_IDS]
const ALLOWED_USERS = [...OWNER_IDS, ...BOT_DEVELOPER_IDS]

module.exports = class TasksEnableCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'task',
          type: 'task',
          prompt: 'the task to view info about?',
        },
      ],
      name: 'task-info',
      group: 'tasks',
      aliases: ['task'],
      guildOnly: true,
      memberName: 'info',
      description: 'View information about a task.',
    })
  }

  hasPermission(msg) {
    if (msg.member.roles.some(role => ALLOWED_ROLES.includes(role.id))) {
      return true
    }

    return ALLOWED_USERS.includes(msg.author.id)
  }

  async run(msg, args) {
    const { task } = args

    let ignoredRoles = task.ignored.roles
      .filter(roleId => {
        return msg.guild.roles.has(roleId)
      })
      .map(roleId => {
        return msg.guild.roles.get(roleId)
      })
    let ignoredUsers = task.ignored.users
      .filter(userId => {
        return msg.guild.members.has(userId)
      })
      .map(userId => {
        return this.client.users.get(userId)
      })
    let ignoredChannels = task.ignored.channels
      .filter(chanId => {
        return msg.guild.channels.has(chanId)
      })
      .map(chanId => {
        return this.client.channels.get(chanId)
      })

    if (!ignoredRoles.length) {
      ignoredRoles = ['None']
    }
    if (!ignoredUsers.length) {
      ignoredUsers = ['None']
    }
    if (!ignoredChannels.length) {
      ignoredChannels = ['None']
    }

    const embed = new RichEmbed()
    embed.setTitle('Task (' + task.name + ')')
    embed.setDescription(task.description)
    embed.addField('Enabled', inlineCode(task.getStatus()), true)
    embed.addField('Guild Only', task.guildOnly, true)
    embed.addField('DM Only', task.dmOnly, true)
    embed.addField('Ignored Users', ignoredUsers.join(', '), true)
    embed.addField('Ignored Roles', ignoredRoles.join(', '), true)
    embed.addField('Ignored Channels', ignoredChannels.join(', '), true)
    embed.addField(
      'Configuration',
      blockCode(JSON.stringify(task.config, null, 2), 'json')
    )

    return msg.channel.send(EMPTY_MESSAGE, { embed })
  }
}
