import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  DEFAULT_EMBED_COLOUR,
  respondWithPaginatedEmbed,
} from '../../utils/embed'
import etiquette from '../../../data/etiquette'

module.exports = class InfoQuestionEqiquetteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'etiquette',
      group: 'informational',
      args: [
        {
          key: 'member',
          type: 'member',
          prompt: 'who to DM the message to (optional)?',
          default: 'none',
        },
      ],
      aliases: ['howtoask', 'asking'],
      guildOnly: false,
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
    }

    return respondWithPaginatedEmbed(
      msg,
      null,
      etiquette.map(item => this.buildResponseEmbed(msg, item)),
      [],
      {
        sendToChannel,
      }
    )
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
