import { Command } from 'discord.js-commando'
import axios from 'axios'
import { RichEmbed } from 'discord.js'
import { cleanupInvocation } from '../../utils/messages'
import { inlineCode } from '../../utils/string'
import {
  respondWithPaginatedEmbed,
  createDefaultEmbed,
} from '../../utils/embed'

const MDN_WEB_URL = 'https://developer.mozilla.org/en-US/docs/'
const MDN_SEARCH_URL = 'https://developer.mozilla.org/en-US/search.json?'

const TOPICS = ['api', 'css', 'html', 'http', 'js']

module.exports = class DocsDocsCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'topic',
          type: 'string',
          prompt: `a topic to filter results by (${TOPICS.join(', ')})`,
        },
        {
          key: 'query',
          type: 'string',
          prompt: 'keyword(s) to search for on MDN?',
          default: 'none',
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
    let { query, topic } = args

    if (!TOPICS.includes(topic) && query === 'none') {
      query = topic
    }

    const params = new URLSearchParams()
    params.append('locale', 'en-US')
    params.append('highlight', false) // Remove <mark> elements.
    params.append('q', query)

    if (topic !== 'all') {
      params.append('topic', topic)
    }

    try {
      const response = await axios.get(MDN_SEARCH_URL + params)

      if (response.data.documents.length) {
        const documents = response.data.documents

        return respondWithPaginatedEmbed(
          msg,
          null,
          documents.map(doc => this.buildResponseEmbed(msg, doc))
        )
      }

      const embed = new RichEmbed()
        .setTitle('No results found matching query')
        .addField('Query', query)

      await msg.channel.send(embed)
      cleanupInvocation(msg)
    } catch (error) {
      console.error(error)

      await msg.reply('Something went wrong.')
      cleanupInvocation(msg)
    }
  }

  buildResponseEmbed(msg, doc) {
    let footer = []

    if (doc.category) {
      footer.push(`Category: ${doc.category}`)
    }

    if (doc.tags && doc.tags.length) {
      footer.push(`Tags: ${doc.tags.map(inlineCode).join(', ')}`)
    }

    const embed = createDefaultEmbed(msg, { logo: false })
      .setTitle(`MDN - ${doc.title}`)
      .setDescription(doc.excerpt)
      .setURL(`${MDN_WEB_URL}${doc.slug}`)
      .setColor('#000000')
      .setThumbnail('attachment://mdn.png')
      .attachFile({
        attachment: 'assets/images/mdn.png',
        name: 'mdn.png',
      })

    if (footer.length) {
      embed.setFooter(footer.join(' | '))
    }

    return embed
  }
}
