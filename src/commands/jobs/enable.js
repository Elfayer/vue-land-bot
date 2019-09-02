import { Command } from 'discord.js-commando'
import {
  OWNER_IDS,
  BOT_DEVELOPER_IDS,
  MODERATOR_ROLE_IDS,
} from '../../utils/constants'

const ALLOWED_ROLES = [...OWNER_IDS, ...BOT_DEVELOPER_IDS, MODERATOR_ROLE_IDS]

export default class JobsEnableCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'job',
          type: 'job',
          prompt: 'the job to enable?',
        },
      ],
      name: 'enable-job',
      group: 'mod',
      aliases: ['je'],
      guildOnly: true,
      memberName: 'jobs-enable',
      description: 'Enable a job',
    })
  }

  hasPermission(msg) {
    return msg.member.roles.some(role => ALLOWED_ROLES.includes(role.id))
  }

  async run(msg, args) {
    const { job } = args

    if (!job.enabled) {
      job.enabled = true
      return msg.channel.send(`Job "${job} has been enabled.`)
    } else {
      return msg.channel.send(`Job "${job} was already enabled.`)
    }
  }
}
