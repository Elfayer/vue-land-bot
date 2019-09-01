import { Command } from "discord.js-commando"

import { banWords } from '../../services/ban-words'

export default class ModerationListBanWordsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list-ban-words',
      group: 'mod',
      aliases: ['lbw'],
      guildOnly: true,
      memberName: 'mod-list-ban-words',
      description: 'List all banned words.'
    })
  }

  /*
    TODO: Add adequate permission check.
  */
  hasPermission(msg) {
    return true
  }

  async run(msg, args) {
    return msg.channel.send(`Ban words: ${banWords.toString()}`)
  }
}
