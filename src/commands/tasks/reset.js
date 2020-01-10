import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  OWNER_IDS,
  BOT_DEVELOPER_IDS,
  MODERATOR_ROLE_IDS,
} from '../../utils/constants'
import { reset } from '../../services/tasks'

const ALLOWED_ROLES = [...MODERATOR_ROLE_IDS]
const ALLOWED_USERS = [...OWNER_IDS, ...BOT_DEVELOPER_IDS]

module.exports = class TasksEnableCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reset-tasks',
      group: 'tasks',
      guildOnly: true,
      memberName: 'reset',
      description: 'Reset task configurations.',
    })
  }

  hasPermission(msg) {
    if (msg.member.roles.some(role => ALLOWED_ROLES.includes(role.id))) {
      return true
    }

    return ALLOWED_USERS.includes(msg.author.id)
  }

  async run(msg) {
    reset()

    msg.channel.send(
      new RichEmbed()
        .setTitle('Reset Tasks')
        .setColor('GREEN')
        .setDescription('Reset task configurations to defaults in task files.')
    )
  }
}
