import { Command } from 'discord.js-commando'
import axios from 'axios'
import { RichEmbed } from 'discord.js'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { tryDelete } from '../../utils/messages'
import { addEllipsis } from '../../utils/string'

const MDN_SEARCH_URL = 'https://developer.mozilla.org/en-US/search.json?'

module.exports = class DocsDocsCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'query',
          type: 'string',
          prompt: 'keyword(s) to search for on MDN?',
        },
      ],
      name: 'mdn',
      group: 'documentation',
      examples: [
        inlineCode('!mdn map'),
        inlineCode('!mdn map js'),
        inlineCode('!mdn map html'),
        inlineCode("!mdn 'Array filter' js"),
      ],
      guildOnly: false,
      memberName: 'mdn',
      description: 'Search the Mozilla Developer Network.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    let { query } = args

    const embed = this.createEmbed()

    const params = new URLSearchParams()
    params.append('locale', 'en-US')
    params.append('highlight', false) // Remove <mark> elements.
    params.append('q', query)

    try {
      const response = await axios.get(MDN_SEARCH_URL + params)

      if (response.data.documents.length) {
        const doc = response.data.documents[0]
        const excerpt = addEllipsis(doc.excerpt)

        embed
          .setTitle(doc.title)
          .setDescription(excerpt)
          .setURL(doc.url)
          .addField('Tags', doc.tags.join(', '), true)
      } else {
        embed
          .setTitle('No results found matching query')
          .addField('Query', query)
      }

      embed.addField('Requested by', msg.author, true)

      msg.channel.send(EMPTY_MESSAGE, { embed }).then(() => tryDelete(msg))
    } catch (error) {
      console.error(error)

      return msg.reply('Something went wrong.').then(reply => {
        tryDelete(msg)
        tryDelete(reply, 5000)
      })
    }
  }

  createEmbed() {
    return new RichEmbed()
      .setAuthor(
        'Mozilla Developer Network',
        null,
        'https://developer.mozilla.org/en-US/'
      )
      .setColor('#000000')
      .setThumbnail('attachment://mdn.png')
      .attachFile({
        attachment: 'assets/images/mdn.png',
        name: 'mdn.png',
      })
  }
}
