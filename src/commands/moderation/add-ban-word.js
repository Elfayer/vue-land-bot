import { Command } from "discord.js-commando"

import { banWords, saveToFile, toString } from "../../services/ban-words"
import { MODERATOR_ROLE_IDS } from "../../utils/constants"

export default class ModerationAddBanWordCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'word',
          type: 'string',
          prompt: 'the word to add?'
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

  hasPermission(msg) {
    return msg.member.roles.some((role) => MODERATOR_ROLE_IDS.includes(role.id))
  }

  async run(msg, args) {
    const { word } = args

    banWords.push(word)
    saveToFile()

    return msg.channel.send(`Ban words: ${toString()}`)
  }
}
