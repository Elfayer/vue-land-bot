import { Command } from 'discord.js-commando'

import { banWords } from '../../services/ban-words'
import { MODERATOR_ROLE_IDS } from '../../utils/constants'

export default class ModerationListBanWordsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list-ban-words',
      group: 'mod',
      aliases: ['lbw'],
      guildOnly: true,
      memberName: 'mod-list-ban-words',
      description: 'List all banned words.',
    })
  }

  hasPermission(msg) {
    return msg.member.roles.some(role => MODERATOR_ROLE_IDS.includes(role.id))
  }

  async run(msg) {
    return msg.channel.send(`Ban words: ${banWords.toString()}`)
  }
}
