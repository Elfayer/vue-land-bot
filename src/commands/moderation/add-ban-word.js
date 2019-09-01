import { Command } from "discord.js-commando"

import { banWords, saveToFile, toString } from "../../services/ban-words"

export default class ModerationAddBanWordCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'word',
          type: 'string'
        }
      ],
      name: 'add-ban-word',
      group: 'mod',
      aliases: [],
      guildOnly: true,
      memberName: 'mod-add-ban-word',
      description: 'Add a word to the ban list.'
    })
  }

  /*
    TODO: Add adequate permission check.
  */
  hasPermission(msg) {
    return true
  }

  async run(msg, args) {
    const { word } = args

    banWords.push(word)
    saveToFile()

    return msg.channel.send(`Ban words: ${toString()}`)
  }
}
