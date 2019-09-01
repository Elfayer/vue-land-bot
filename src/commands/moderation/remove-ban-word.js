import { Command } from "discord.js-commando"

import { banWords, saveToFile, toString } from "../../services/ban-words"

export default class ModerationRemoveBanWordCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-ban-word',
      group: 'mod',
      aliases: ['rbw'],
      guildOnly: true,
      memberName: 'mod-remove-ban-word',
      description: 'Remove a banned word.'
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
    const foundIndex = banWords.findIndex(w => w.toLowerCase() === word.toLowerCase())

    if (foundIndex >= 0) {
      banWords.splice(foundIndex, 1)
      saveToFile()
      msg.channel.send(`Ban words: ${toString()}`)
    } else {
      msg.channel.send(`I cannot find the word "${word}" in the banned words list.`)
    }
  }
}
