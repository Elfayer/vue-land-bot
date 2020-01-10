import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { getAllRFCs } from '../../services/rfcs'
import {
  respondWithPaginatedEmbed,
  DEFAULT_EMBED_COLOUR,
} from '../../utils/embed'
import { stripIndent } from 'common-tags'
import { inlineCode } from '../../utils/string'
import { cleanupInvocation } from '../../utils/messages'
import { EMPTY_MESSAGE } from '../../utils/constants'

const RFCS_PER_PAGE = 5

module.exports = class RFCsCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'filter',
          type: 'string',
          validate(value) {
            return ['all', 'open', 'closed', 'merged'].includes(value)
          },
          prompt:
            'Would you like to view `all`, `open`, `closed` or `merged` RFCs?',
          default: 'all',
        },
      ],
      name: 'list-rfcs',
      group: 'rfcs',
      aliases: ['rfcs'],
      examples: [
        '!rfcs',
        '!rfcs all',
        '!rfcs open',
        '!rfcs closed',
        '!rfcs merged',
      ],
      guildOnly: false,
      memberName: 'rfcs',
      description: 'List all (open/closed/merged) RFCs.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { filter } = args

    const embed = new RichEmbed()
      .setTitle('RFCs List')
      .setColor(DEFAULT_EMBED_COLOUR)
      .setThumbnail('attachment://vue.png')
      .attachFile({
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      })

    try {
      let rfcs = await getAllRFCs()

      if (filter === 'open' || filter === 'closed') {
        rfcs = rfcs.filter(rfc => rfc.state === filter)
      } else if (filter === 'merged') {
        rfcs = rfcs.filter(rfc => rfc.merged_at !== null)
      }

      embed.setDescription(
        stripIndent`
          Viewing ${rfcs.length} RFCs filtered by: ${inlineCode(filter)}.
          
          To view a specific RFC, use ${inlineCode('!rfc #<number>')}.

          Or use ${inlineCode(
            '!rfc <query>'
          )} to search through titles, bodies, labels and authors.
        `
      )

      respondWithPaginatedEmbed(msg, embed, this.createRFCFields(rfcs), [], {
        itemsPerPage: RFCS_PER_PAGE,
        observeReactionsFor: 1000 * 60 * 5,
      })
      cleanupInvocation(msg)
    } catch (e) {
      const response = await msg.reply(EMPTY_MESSAGE, {
        embed: this.buildErrorEmbed(msg, 'Sorry, an unknown error occured.'),
      })
      cleanupInvocation(msg)
    }
  }

  createRFCFields(rfcs) {
    return rfcs.map(rfc => {
      return {
        name: `#${rfc.number} - ${rfc.title}`,
        value: rfc.html_url,
      }
    })
  }

  buildErrorEmbed(msg, error) {
    return new RichEmbed()
      .setTitle(`RFCs List`)
      .setDescription(error)
      .setAuthor(
        (msg.member ? msg.member.displayName : msg.author.username) +
          ' requested:',
        msg.author.avatarURL
      )
      .setColor('RED')
  }
}
