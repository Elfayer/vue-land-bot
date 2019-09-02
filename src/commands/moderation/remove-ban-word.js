import { Command } from 'discord.js-commando'

import { banWords, saveToFile, toString } from '../../services/ban-words'
import { MODERATOR_ROLE_IDS } from '../../utils/constants'

module.exports = class ModerationRemoveBanWordCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'word',
          type: 'string',
          prompt: 'the word to add?',
        },
      ],
      name: 'remove-ban-word',
      group: 'moderation',
      aliases: ['rbw', 'del-ban-word', 'rm-ban-word'],
      guildOnly: true,
      memberName: 'remove-ban-word',
      description: 'Remove a banned word.',
    })
  }

  hasPermission(msg) {
    return msg.member.roles.some(role => MODERATOR_ROLE_IDS.includes(role.id))
  }

  async run(msg, args) {
    const { word } = args
    const foundIndex = banWords.findIndex(
      w => w.toLowerCase() === word.toLowerCase()
    )

    if (foundIndex >= 0) {
      banWords.splice(foundIndex, 1)
      saveToFile()
      msg.channel.send(`Ban words: ${toString()}`)
    } else {
      msg.channel.send(
        `I cannot find the word "${word}" in the banned words list.`
      )
    }
  }
}
