import { Command } from 'discord.js-commando'
import {
  OWNER_IDS,
  BOT_DEVELOPER_IDS,
  MODERATOR_ROLE_IDS,
} from '../../utils/constants'

const ALLOWED_ROLES = [...MODERATOR_ROLE_IDS]
const ALLOWED_USERS = [...OWNER_IDS, ...BOT_DEVELOPER_IDS]

module.exports = class JobsDisableCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'job',
          type: 'job',
          prompt: 'the job to disable?',
        },
      ],
      name: 'disable-job',
      group: 'jobs',
      aliases: ['jd'],
      guildOnly: true,
      memberName: 'disable',
      description: 'Disable a job',
    })
  }

  hasPermission(msg) {
    if (msg.member.roles.some(role => ALLOWED_ROLES.includes(role.id)))
      return true

    return ALLOWED_USERS.includes(msg.author.id)
  }

  async run(msg, args) {
    const { job } = args

    if (job.enabled) {
      job.enabled = false
      return msg.channel.send(`Job "${job}" has been disabled.`)
    } else {
      return msg.channel.send(`Job "${job}" was already disabled.`)
    }
  }
}
