import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  OWNER_IDS,
  BOT_DEVELOPER_IDS,
  MODERATOR_ROLE_IDS,
} from '../../utils/constants'
import { inlineCode } from '../../utils/string'

const ALLOWED_ROLES = [...MODERATOR_ROLE_IDS]
const ALLOWED_USERS = [...OWNER_IDS, ...BOT_DEVELOPER_IDS]

module.exports = class TasksDisableCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'task',
          type: 'task',
          prompt: 'the task to disable?',
        },
      ],
      name: 'disable-task',
      group: 'tasks',
      guildOnly: true,
      memberName: 'disable',
      description: 'Disable a task',
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

    let alreadyDisabled = !task.enabled

    if (task.enabled) {
      task.enabled = false
    }

    msg.channel.send(
      new RichEmbed()
        .setTitle('Disable Task')
        .setColor(alreadyDisabled ? 'ORANGE' : 'GREEN')
        .setDescription(
          alreadyDisabled
            ? `Task ${inlineCode(task.name)} was already disabled.`
            : `Sucessfully disabled task ${inlineCode(task.name)}.`
        )
    )
  }
}
