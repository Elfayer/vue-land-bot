import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  EMPTY_MESSAGE,
  OWNER_IDS,
  BOT_DEVELOPER_IDS,
  MODERATOR_ROLE_IDS,
} from '../../utils/constants'

const ALLOWED_ROLES = [...MODERATOR_ROLE_IDS]
const ALLOWED_USERS = [...OWNER_IDS, ...BOT_DEVELOPER_IDS]

module.exports = class JobsEnableCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list-jobs',
      group: 'jobs',
      aliases: ['jl'],
      guildOnly: true,
      memberName: 'list',
      description: 'List all jobs.',
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
    embed.setTitle('Job List')
    embed.setDescription(
      'Jobs are basically micro-tasks which are executed for every message.'
    )

    this.client.jobs.forEach(job => {
      embed.addField(job.name, job.getStatus(), true)
    })

    return msg.channel.send(EMPTY_MESSAGE, { embed })
  }
}
