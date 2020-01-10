import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import moderation from '../../services/moderation'
import { MODERATOR_ROLE_IDS, BOT_DEVELOPER_IDS } from '../../utils/constants'
import { inlineCode } from '../../utils/string'

const { NODE_ENV } = process.env

module.exports = class ModerationRemoveTriggersCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'trigger',
          type: 'string',
          prompt: 'the trigger word to remove?',
        },
      ],
      name: 'remove-trigger',
      group: 'moderation',
      aliases: ['del-trigger', 'rem-trigger'],
      guildOnly: true,
      memberName: 'remove',
      description: 'Remove a trigger word from the moderation system.',
    })
  }

  hasPermission(msg) {
    if (NODE_ENV === 'development') {
      if (BOT_DEVELOPER_IDS.includes(msg.author.id)) {
        return true
      }
    }

    return msg.member.roles.some(role => MODERATOR_ROLE_IDS.includes(role.id))
  }

  async run(msg, args) {
    let { trigger } = args

    const exists = moderation
      .get('triggers')
      .find(item => item.trigger === trigger.toLowerCase())
      .value()

    if (!exists) {
      return msg.channel.send(
        new RichEmbed()
          .setTitle('Moderation - Remove Trigger')
          .setColor('ORANGE')
          .setDescription(`That trigger doesn't exist!`)
      )
    }

    const action = exists.action

    moderation
      .get('triggers')
      .remove({ trigger })
      .write()

    msg.channel.send(
      new RichEmbed()
        .setTitle('Moderation - Remove Trigger')
        .setColor('GREEN')
        .setDescription(
          `Successfully removed trigger word ${inlineCode(
            trigger
          )} with action ${inlineCode(action)}.`
        )
    )
  }
}
