import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  DEFAULT_EMBED_COLOUR,
  respondWithPaginatedEmbed,
} from '../../utils/embed'
import sharing from '../../../data/sharing'

module.exports = class MiscSharingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'sharing',
      group: 'miscellaneous',
      args: [
        {
          key: 'member',
          type: 'member',
          prompt: 'who to DM the message to (optional)?',
          default: 'none',
        },
      ],
      aliases: ['sharingcode', 'reproduction', 'repro'],
      guildOnly: false,
      memberName: 'sharing',
      description:
        'Explain how to share code, to aid reproduction and helping.',
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
      sharing.map(item => this.buildResponseEmbed(msg, item)),
      [],
      {
        sendToChannel,
      }
    )
  }

  buildResponseEmbed(msg, entry) {
    return new RichEmbed()
      .setColor(DEFAULT_EMBED_COLOUR)
      .setTitle(`Sharing Code - ${entry.title}`)
      .setURL(entry.url)
      .setThumbnail('attachment://vue.png')
      .attachFile({
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      })
      .setDescription(entry.description)
  }
}
