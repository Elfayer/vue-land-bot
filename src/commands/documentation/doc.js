import { Command } from 'discord.js-commando'
import { getDoc, findDoc, DocNotFoundError } from '../../services/docs'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { inlineCode } from '../../utils/string'
import { cleanupInvocation } from '../../utils/messages'
import {
  respondWithPaginatedEmbed,
  createDefaultEmbed,
} from '../../utils/embed'

module.exports = class DocumentationDocCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'lookup',
          type: 'string',
          prompt: 'what do you want to look up in the guide?',
        },
      ],
      name: 'doc',
      examples: [
        inlineCode('!doc intro'),
        inlineCode('!doc class binding'),
        inlineCode('!doc props'),
        inlineCode('!doc mixins'),
        inlineCode('!doc jsx'),
        inlineCode('!doc sfc'),
        inlineCode('!doc ssr'),
        inlineCode('!doc cookbook'),
        inlineCode('!doc examples'),
        inlineCode('!doc style guide'),
      ],
      group: 'documentation',
      aliases: ['d', 'docs', 'guide'],
      guildOnly: false,
      memberName: 'doc',
      description: 'Look something up in the guide.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { lookup } = args

    let embed

    try {
      if (lookup.length < 3) {
        throw new Error('Queries must be 3 characters or more.')
      }

      // Try to find an exact match (or alias).
      let doc = getDoc(lookup)

      if (doc) {
        embed = this.buildResponseEmbed(msg, doc)
      } else {
        // Attempt a fuzzy search.
        doc = findDoc(lookup)

        if (doc) {
          if (doc.length > 1) {
            return respondWithPaginatedEmbed(
              msg,
              this.buildDisambiguationEmbed(msg, lookup, doc),
              doc.map(item => this.buildResponseEmbed(msg, item))
            )
          } else if (doc.length === 1) {
            embed = this.buildResponseEmbed(msg, doc[0])
          }
        }
      }

      if (!doc || doc.length === 0) {
        throw new DocNotFoundError(
          "Sorry, I couldn't find any matches for your query in the guide."
        )
      }

      await msg.channel.send(EMPTY_MESSAGE, { embed })
      cleanupInvocation(msg)
    } catch (error) {
      console.error(error)

      await msg.channel.send(EMPTY_MESSAGE, {
        embed: this.buildErrorEmbed(msg, lookup, error),
      })
      cleanupInvocation(msg)
    }
  }

  buildErrorEmbed(msg, lookup, error) {
    return createDefaultEmbed(msg)
      .setTitle(`Guide Lookup: ${inlineCode(lookup)}`)
      .setDescription(error.message)
      .setColor('RED')
  }

  buildDisambiguationEmbed(msg, lookup, results) {
    return createDefaultEmbed(msg)
      .setTitle(`Guide Lookup: ${inlineCode(lookup)}`)
      .setDescription(
        "Sorry, I couldn't find an exact match for your query in the guide."
      )
      .addField(
        'Perhaps you meant one of these:',
        results.map(result => inlineCode(result.id)).join(', ')
      )
      .setColor('BLUE')
  }

  buildResponseEmbed(msg, doc) {
    const embed = createDefaultEmbed(msg)
      .setURL(doc.link)
      .setTitle(doc.title)
      .setFooter(`Category: ${doc.category}`)

    if (doc.description) {
      embed.setDescription(doc.description)
    }

    if (doc.see && doc.see.length) {
      embed.addField('See Also', doc.see.join('\n'))
    }

    return embed
  }
}
