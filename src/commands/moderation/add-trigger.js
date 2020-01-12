import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import moderation from '../../services/moderation'
import { MODERATOR_ROLE_IDS, BOT_DEVELOPER_IDS } from '../../utils/constants'
import { inlineCode } from '../../utils/string'

const { NODE_ENV } = process.env
const VALID_ACTIONS = ['warn', 'kick', 'ban', 'notify']

module.exports = class ModerationAddTriggerCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'action',
          type: 'string',
          prompt: `which action should be taken (${VALID_ACTIONS.map(
            inlineCode
          ).join(', ')})?`,
          validate(value) {
            return VALID_ACTIONS.includes(value)
          },
        },
        {
          key: 'trigger',
          type: 'string',
          prompt:
            'the trigger word to add (use quotation marks if it contains spaces)?',
        },
      ],
      name: 'add-trigger',
      group: 'moderation',
      aliases: ['create-trigger'],
      examples: [
        `${inlineCode(
          '!add-trigger warn naughty'
        )} - Warn via DM if message contains "naughty".`,
        `${inlineCode(
          '!add-trigger notify VueBot sucks'
        )} - Notify moderators if message contains "VueBot sucks".`,
        `${inlineCode(
          '!add-trigger kick www.obvious-bot-spam-link.com'
        )} - Kick user if message contains "www.obvious-bot-spam-link.com"`,
        `${inlineCode(
          '!add-trigger ban jQuery'
        )} - Ban user if message contains "jQuery".'`,
      ],
      guildOnly: true,
      memberName: 'add',
      description: 'Add a trigger word/phrase to the moderation system.',
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
    const { trigger, action } = args

    const exists = moderation
      .get('triggers')
      .find(item => item.trigger === trigger)
      .value()

    if (exists) {
      msg.channel.send(
        new RichEmbed()
          .setTitle('Moderation - Add Trigger')
          .setColor('ORANGE')
          .setDescription(
            `That trigger already exists (action: ${inlineCode(exists.action)})`
          )
      )
    } else {
      moderation
        .get('triggers')
        .push({ trigger: trigger.toLowerCase(), action })
        .write()

      msg.channel.send(
        new RichEmbed()
          .setTitle('Moderation - Add Trigger')
          .setColor('GREEN')
          .setDescription(
            `Successfully added trigger word/pharse ${inlineCode(
              trigger
            )} with action ${inlineCode(action)}.`
          )
      )
    }
  }
}
