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
      args: [
        {
          key: 'job',
          type: 'job',
          prompt: 'the job to view info about?',
        },
      ],
      name: 'job-info',
      group: 'jobs',
      aliases: ['ji'],
      guildOnly: true,
      memberName: 'info',
      description: 'View information about a job.',
    })
  }

  hasPermission(msg) {
    if (msg.member.roles.some(role => ALLOWED_ROLES.includes(role.id)))
      return true

    return ALLOWED_USERS.includes(msg.author.id)
  }

  async run(msg, args) {
    const { job } = args

    let ignoredRoles = job.ignored.roles.map(roleId => {
      return msg.guild.roles.get(roleId).name
    })

    if (!ignoredRoles.length) ignoredRoles = ['None']

    const embed = new RichEmbed()
    embed.setTitle('Job (' + job.name + ')')
    embed.setDescription(job.description)
    embed.addField('Status', job.enabled)
    embed.addField('Guild Only', job.guildOnly)
    embed.addField('Ignored Roles', ignoredRoles.join(', '))

    return msg.channel.send(EMPTY_MESSAGE, { embed })
  }
}
