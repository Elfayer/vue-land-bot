import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import moderation from '../../services/moderation'
import { MODERATOR_ROLE_IDS, BOT_DEVELOPER_IDS } from '../../utils/constants'
import { inlineCode } from '../../utils/string'

const { NODE_ENV } = process.env

module.exports = class ModerationListTriggersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list-triggers',
      group: 'moderation',
      guildOnly: true,
      examples: [`${inlineCode('!list-triggers')} - List moderation triggers.`],
      aliases: ['triggers'],
      memberName: 'list',
      description: 'List all trigger words/phrases from the moderation system.',
    })
  }

  hasPermission(msg) {
    if (NODE_ENV === 'development') {
      if (BOT_DEVELOPER_IDS.includes(msg.member.id)) {
        return true
      }
    }

    return msg.member.roles.some(role => {
      if (MODERATOR_ROLE_IDS.includes(role.id)) {
        return true
      }
    })
  }

  async run(msg) {
    const triggers = moderation.get('triggers').value()

    const embed = new RichEmbed()
      .setTitle('Moderation Triggers')
      .setColor('ORANGE')
      .setDescription(
        triggers
          .map(
            trigger => `**${trigger.trigger}** - ${inlineCode(trigger.action)}`
          )
          .join('\n')
      )

    return msg.reply(embed)
  }
}
