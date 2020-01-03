import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  findRFCs,
  filterRFCsBy,
  RFCDoesNotExistError,
} from '../../services/rfcs'
import {
  EMPTY_MESSAGE,
  DISCORD_EMBED_DESCRIPTION_LIMIT,
} from '../../utils/constants'
import { cleanupErrorResponse, cleanupInvocation } from '../../utils/messages'
import { inlineCode, addEllipsis } from '../../utils/string'
import {
  respondWithPaginatedEmbed,
  DEFAULT_EMBED_COLOUR,
} from '../../utils/embed'

module.exports = class RFCsCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'query',
          type: 'optional-kv-pair',
          prompt: 'an RFC number, title, body, author or label to search for?',
          validate(val) {
            if (Array.isArray(val)) {
              return ['id', 'title', 'body', 'author', 'label'].includes(val[0])
            }

            return true
          },
        },
      ],
      name: 'rfc',
      examples: [
        inlineCode('!rfcs'),
        inlineCode('!rfc #23'),
        inlineCode('!rfc initial placeholder'),
        inlineCode('!rfc empty node'),
        inlineCode('!rfc yyx'),
        inlineCode('!rfc core'),
        inlineCode('!rfc id:29'),
        inlineCode('!rfc title:initial placeholder'),
        inlineCode('!rfc body:empty node'),
        inlineCode('!rfc author:yyx'),
        inlineCode('!rfc label:core'),
        inlineCode('!rfc label:breaking change,router'),
        inlineCode('!rfc label:3.x | core'),
      ],
      group: 'rfcs',
      guildOnly: false,
      memberName: 'rfc',
      description: 'Search for and view a Vue RFC.',
      argsPromptLimit: 1,
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    let { query } = args
    let success = false
    let [filter, value] = query

    let embed

    try {
      let rfcs

      if (filter === 'empty') {
        rfcs = await findRFCs(value)
      } else {
        rfcs = await filterRFCsBy(filter, value)
      }

      if (rfcs.length === 0) {
        throw new RFCDoesNotExistError()
      } else if (rfcs.length === 1) {
        embed = this.buildResponseEmbed(msg, rfcs[0])
      } else {
        return respondWithPaginatedEmbed(
          msg,
          this.buildDisambiguationEmbed(msg, rfcs, filter, value),
          rfcs.map(rfc => this.buildResponseEmbed(msg, rfc, filter, value))
        )
      }

      success = true // For finally block.
    } catch (error) {
      if (error instanceof RFCDoesNotExistError) {
        embed = this.buildErrorEmbed(msg, 'No matching RFCs found!')
      } else {
        console.error(error)
        embed = this.buildErrorEmbed(
          msg,
          'Sorry, an unspecified error occured!'
        )
      }
    } finally {
      const reply = await msg.channel.send(EMPTY_MESSAGE, embed)
      cleanupInvocation(msg)

      if (!success) {
        cleanupErrorResponse(reply)
      }
    }
  }

  buildErrorEmbed(msg, error) {
    return new RichEmbed()
      .setTitle('RFC Request')
      .setDescription(error)
      .setAuthor(
        (msg.member ? msg.member.displayName : msg.author.username) +
          ' requested:',
        msg.author.avatarURL
      )
      .setColor('RED')
  }

  buildResponseEmbed(msg, rfc) {
    const embed = new RichEmbed()
      .setTitle(`RFC #${rfc.number} - ${rfc.title}`)
      .setAuthor(
        (msg.member ? msg.member.displayName : msg.author.username) +
          ' requested:',
        msg.author.avatarURL
      )
      .setURL(rfc.html_url)
      .setThumbnail('attachment://vue.png')
      .attachFile({
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      })
      .addField('Author', rfc.user.login, true)
      .addField('Status', rfc.state, true)

    embed.setDescription(
      addEllipsis(
        rfc.body.replace(/(?<=```)[ ]*(?=\w+)/g, ''),
        DISCORD_EMBED_DESCRIPTION_LIMIT
      )
    )

    let footerSections = []

    if (rfc.created_at) {
      footerSections.push(
        'Created: ' + new Date(rfc.created_at).toLocaleDateString()
      )
    }

    if (rfc.updated_at) {
      footerSections.push(
        'Updated: ' + new Date(rfc.updated_at).toLocaleDateString()
      )
    }

    if (footerSections.length) {
      embed.setFooter(footerSections.join(' | '))
    }

    if (rfc.labels.length) {
      embed.addField(
        'Labels',
        rfc.labels.map(label => label.name).join(', '),
        true
      )
    }

    let labelsWithColours = rfc.labels.filter(label =>
      ['core', 'vuex', 'router'].includes(label.name)
    )

    if (labelsWithColours.length) {
      embed.setColor(`#${labelsWithColours[0].color}`)
    } else {
      embed.setColor(DEFAULT_EMBED_COLOUR)
    }

    return embed
  }

  buildDisambiguationEmbed(msg, rfcs, filter, value) {
    let query = filter === 'empty' ? value : `${filter}:${value}`

    return new RichEmbed()
      .setTitle(`RFC Request - ${inlineCode(query)}`)
      .setDescription(`Found ${rfcs.length} matching results:`)
  }
}
