import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { reloadCache } from '../../services/rfcs'
import { EMPTY_MESSAGE, ROLES } from '../../utils/constants'
import { cleanupInvocation } from '../../utils/messages'

const ALLOWED_ROLES = [ROLES.MODERATORS, ROLES.CORE_TEAM, ROLES.BOT_DEVELOPERS]

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

  hasPermission(msg) {
    if (msg.member.roles.some(role => ALLOWED_ROLES.includes(role.id))) {
      return true
    }

    return false
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
      await msg.channel.send(EMPTY_MESSAGE, { embed })
      cleanupInvocation(msg)
    }
  }
}
