import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  DEFAULT_EMBED_COLOUR,
  respondWithPaginatedEmbed,
} from '../../utils/embed'
import etiquette from '../../../data/etiquette'
import { cleanupInvocation } from '../../utils/messages'

module.exports = class InfoQuestionEqiquetteCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'member',
          type: 'member',
          prompt: 'who to DM the message to (optional)?',
          default: 'none',
        },
      ],
      name: 'etiquette',
      group: 'informational',
      examples: [
        inlineCode('!etiquette'),
        inlineCode('!etiquette user'),
        inlineCode('!etiquette @user#1234'),
      ],
      aliases: ['howtoask', 'asking'],
      guildOnly: true,
      memberName: 'etiquette',
      description: 'Explain the etiquette of asking questions.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { member } = args

    let sendToChannel
    if (member === 'none') {
      sendToChannel = msg.channel
    } else {
      sendToChannel = await member.createDM()
      let response = await msg.reply(
        `okay, I sent ${member.displayName} a DM about that as requested.`
      )
      cleanupInvocation(response)
    }

    respondWithPaginatedEmbed(
      msg,
      null,
      etiquette.map(item => this.buildResponseEmbed(msg, item)),
      [],
      {
        sendToChannel,
      }
    )

    cleanupInvocation(msg)
  }

  buildResponseEmbed(msg, entry) {
    return new RichEmbed()
      .setColor(DEFAULT_EMBED_COLOUR)
      .setTitle(`Question Etiquette - ${entry.title}`)
      .setThumbnail('attachment://vue.png')
      .attachFile({
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      })
      .setDescription(entry.description)
  }
}
