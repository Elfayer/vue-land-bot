import { Command } from 'discord.js-commando'
import axios from 'axios'
import { RichEmbed } from 'discord.js'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { tryDelete } from '../../utils/messages'
import { inlineCode } from '../../utils/string'
import { respondWithPaginatedEmbed } from '../../utils/embed'

const MDN_WEB_URL = 'https://developer.mozilla.org/en-US/docs/'
const MDN_SEARCH_URL = 'https://developer.mozilla.org/en-US/search.json?'

const TOPICS = [
  {
    slug: 'api',
    name: 'APIs and DOM',
  },
  {
    slug: 'css',
    name: 'CSS',
  },
  {
    slug: 'html',
    name: 'HTML',
  },
  {
    slug: 'http',
    name: 'HTTP',
  },
  {
    slug: 'js',
    name: 'JavaScript',
  },
]

module.exports = class DocsDocsCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'query',
          type: 'string',
          prompt: 'keyword(s) to search for on MDN?',
        },
        {
          key: 'topic',
          type: 'string',
          prompt: `an optional topic (${TOPICS.map(topic =>
            inlineCode(topic.slug)
          ).join(', ')})`,
          validate(value) {
            return TOPICS.map(topic => topic.slug).includes(value)
          },
          default: 'all',
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

      msg.channel.send(EMPTY_MESSAGE, { embed }).then(() => tryDelete(msg))
    } catch (error) {
      console.error(error)

      return msg.reply('Something went wrong.').then(reply => {
        tryDelete(msg)
        tryDelete(reply, 5000)
      })
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

    const embed = new RichEmbed()
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
