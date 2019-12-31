import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  EMPTY_MESSAGE,
  OWNER_IDS,
  BOT_DEVELOPER_IDS,
  MODERATOR_ROLE_IDS,
} from '../../utils/constants'
import { inlineCode } from '../../utils/string'

const ALLOWED_ROLES = [...MODERATOR_ROLE_IDS]
const ALLOWED_USERS = [...OWNER_IDS, ...BOT_DEVELOPER_IDS]

module.exports = class TasksEnableCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list-tasks',
      group: 'tasks',
      aliases: ['tasks'],
      guildOnly: true,
      memberName: 'list',
      description: 'List all tasks.',
    })
  }

  hasPermission(msg) {
    if (msg.member.roles.some(role => ALLOWED_ROLES.includes(role.id))) {
      return true
    }

    return ALLOWED_USERS.includes(msg.author.id)
  }

  async run(msg) {
    const embed = new RichEmbed()
    embed
      .setTitle('Task List')
      .setDescription(`For more info.: ${inlineCode('!task <task-name>')}.`)

    this.client.tasks.forEach(task => {
      embed.addField(task.name, inlineCode(task.getStatus()), true)
    })

    return msg.channel.send(EMPTY_MESSAGE, { embed })
  }
}
