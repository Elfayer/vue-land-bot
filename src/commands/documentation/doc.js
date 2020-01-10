import { Command } from 'discord.js-commando'
import { getDoc, findDoc, DocNotFoundError } from '../../services/docs'
import { RichEmbed } from 'discord.js'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { inlineCode, blockCode } from '../../utils/string'
import { cleanupInvocation, cleanupErrorResponse } from '../../utils/messages'
import {
  DEFAULT_EMBED_COLOUR,
  respondWithPaginatedEmbed,
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

      const reply = await msg.channel.send(EMPTY_MESSAGE, {
        embed: this.buildErrorEmbed(msg, lookup, error),
      })

      cleanupInvocation(msg)
      cleanupErrorResponse(reply)
    }
  }

  buildErrorEmbed(msg, lookup, error) {
    return new RichEmbed()
      .setTitle(`Guide Lookup: ${inlineCode(lookup)}`)
      .setDescription(error.message)
      .setAuthor(
        (msg.member ? msg.member.displayName : msg.author.username) +
          ' requested:',
        msg.author.avatarURL
      )
      .setColor('RED')
  }

  buildDisambiguationEmbed(msg, lookup, results) {
    return new RichEmbed()
      .setTitle(`Guide Lookup: ${inlineCode(lookup)}`)
      .setDescription(
        "Sorry, I couldn't find an exact match for your query in the guide."
      )
      .setThumbnail('attachment://vue.png')
      .attachFile({
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      })
      .addField(
        'Perhaps you meant one of these:',
        results.map(result => inlineCode(result.id)).join(', ')
      )
      .addField(
        'HINT',
        'Use the buttons below to navigate through the matches!'
      )
      .setAuthor(
        (msg.member ? msg.member.displayName : msg.author.username) +
          ' requested:',
        msg.author.avatarURL
      )
      .setColor('BLUE')
  }

  buildResponseEmbed(msg, doc) {
    const embed = new RichEmbed()
      .setTitle(doc.title)
      .setAuthor(
        (msg.member ? msg.member.displayName : msg.author.username) +
          ' requested:',
        msg.author.avatarURL
      )
      .setURL(doc.link)
      .setFooter(`Category: ${doc.category}`)
      .setThumbnail('attachment://vue.png')
      .attachFile({
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      })

    if (doc.description) {
      embed.setDescription(doc.description)
    }

    embed.setColor(DEFAULT_EMBED_COLOUR)

    if (doc.see && doc.see.length) {
      embed.addField('See Also', doc.see.join('\n'))
    }

    return embed
  }
}
