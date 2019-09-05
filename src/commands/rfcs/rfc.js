import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { filterRFCs, RFCDoesNotExistError } from '../../services/rfcs'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { tryDelete } from '../../utils/messages'

module.exports = class RFCsCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'query',
          type: 'optional-kv-pair',
          prompt: 'an RFC number, title, body, author or label to search for?',
          validate(val, msg, arg) {
            if (Array.isArray(val)) {
              return ['id', 'title', 'body', 'author', 'label'].includes(val[0])
            }

            return true
          },
        },
      ],
      name: 'rfc',
      examples: [
        '!rfcs',
        '!rfc #24',
        '!rfc initial placeholder',
        '!rfc empty node',
        '!rfc yyx',
        '!rfc core',
        '!rfc id:24',
        '!rfc title:initial placeholder',
        '!rfc body:empty node',
        '!rfc author:yyx',
        '!rfc label:core',
      ],
      group: 'rfcs',
      guildOnly: true,
      memberName: 'rfc',
      description: 'Search for and view a Vue RFC.',
      argsPromptLimit: 1,
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    let { filter, value } = args
    let success = false

    let embed = new RichEmbed()
      .setTitle(`RFC Request`)
      .setDescription(`Filter: ${filter}=${value}`)

    try {
      const filtered = await filterRFCs(filter, value)

      if (filtered.length === 0) {
        throw new RFCDoesNotExistError()
      }

      embed = this.buildEmbed(embed, filtered, msg.author, filter, value)
      success = true // For finally block.
    } catch (error) {
      if (error instanceof RFCDoesNotExistError) {
        embed.setDescription('RFC not found!')
      } else {
        console.error(error)
        embed.setDescription('Sorry, an unspecified error occured')
      }
    } finally {
      msg.channel.send(EMPTY_MESSAGE, embed).then(reply => {
        tryDelete(msg)

        // Delete the reply if the RFC was not found, or an error occured.
        if (!success) {
          tryDelete(reply, 7500)
        }
      })
    }
  }

  buildEmbed(embed, filtered, author, filter, value) {
    if (filtered.length === 1) {
      return this.buildEmbedSingle(embed, filtered[0], author, filter, value)
    } else {
      return this.buildEmbedMultiple(embed, filtered, author, filter, value)
    }
  }

  buildEmbedSingle(embed, rfc, author, filter, value) {
    embed
      .setTitle(`RFC #${rfc.number} - ${rfc.title}`)
      .setDescription(rfc.body)
      .setAuthor(rfc.user.login, rfc.user.avatar_url, rfc.user.html_url)
      .setTimestamp(rfc.created_at)
      .setURL(rfc.html_url)
      .addField('Status', rfc.state)

    if (rfc.labels.length) {
      embed.addField('Labels', rfc.labels.map(label => label.name).join(', '))
    }

    let labelsWithColours = rfc.labels.filter(label =>
      ['core', 'vuex', 'router'].includes(label.name)
    )

    if (labelsWithColours.length) {
      embed.setColor(`#${labelsWithColours[0].color}`)
    }

    if (filter !== 'id') {
      embed.addField('Request this RFC', `\`!rfc ${filter} '${value}'\``)
    }

    return embed
  }

  /* eslint-disable no-unused-vars */
  buildEmbedMultiple(embed, rfcs, author, filter, value) {
    embed.setTitle(`Found Multiple Matching RFCs`)

    // TODO: Could exceed max allowed number of fields (25)?
    for (const rfc of rfcs) {
      embed.addField(rfc.title, `\`!rfc id ${rfc.number}\``)
    }

    embed.addField('Requested by', author)

    return embed
  }
}

/*
  labels
  body
  url
  state (open, closed)
  title
  created_at
  updated_at
  closed_at
  merged_at
*/
