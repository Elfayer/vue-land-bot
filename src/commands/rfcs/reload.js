import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { reloadCache } from '../../services/rfcs'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { tryDelete } from '../../utils/messages'

module.exports = class RFCsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reload-rfcs',
      group: 'rfcs',
      guildOnly: true,
      memberName: 'reload',
      description: 'Reload the RFCs from the Github API and recache them.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg) {
    const embed = new RichEmbed('Reload RFCs')

    try {
      await reloadCache()
      embed
        .setDescription(
          '✅ Fetched RFC PRs from Github and re-cached them to disc.'
        )
        .setColor('GREEN')
    } catch (error) {
      console.error(error)
      embed
        .setDescription(
          '❎ An error occured while fetching and recaching the RFC PRs.'
        )
        .setColor('RED')
    } finally {
      msg.channel.send(EMPTY_MESSAGE, { embed }).then(res => {
        tryDelete(msg)
        tryDelete(res, 15000)
      })
    }
  }
}
