import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  DEFAULT_EMBED_COLOUR,
  respondWithPaginatedEmbed,
} from '../../utils/embed'
import { cleanupInvocation } from '../../utils/messages'
import { CDN_BASE_URL } from '../../utils/constants'
import sharing from '../../../data/sharing'
import { inlineCode } from '../../utils/string'

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
      examples: [
        inlineCode('!sharing'),
        inlineCode('!sharing user123'),
        inlineCode('!sharing @user456#7890'),
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

    let sendToChannel, response
    if (member === 'none') {
      sendToChannel = msg.channel
    } else {
      sendToChannel = await member.createDM()
      response = await msg.reply(
        'okay, I sent them a DM about that as requested.'
      )
    }

    respondWithPaginatedEmbed(
      msg,
      null,
      sharing.map(item => this.buildResponseEmbed(msg, item)),
      [],
      {
        sendToChannel,
        observeReactionsFor: 1000 * 60 * 30,
      }
    )

    cleanupInvocation(msg)
    cleanupInvocation(response)
  }

  buildResponseEmbed(msg, entry) {
    return new RichEmbed()
      .setColor(DEFAULT_EMBED_COLOUR)
      .setTitle(`Sharing Code - ${entry.title}`)
      .setAuthor(
        entry.title,
        `${CDN_BASE_URL}assets/images/icons/${entry.icon}`,
        entry.url
      )
      .setURL(entry.url)
      .setThumbnail('attachment://vue.png')
      .attachFile({
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      })
      .setDescription(entry.description)
  }
}