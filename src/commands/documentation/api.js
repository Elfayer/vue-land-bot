import { Command } from 'discord.js-commando'
import { getAPI, findAPI, APINotFoundError } from '../../services/api'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { inlineCode, blockCode } from '../../utils/string'
import { cleanupInvocation } from '../../utils/messages'
import {
  respondWithPaginatedEmbed,
  createDefaultEmbed,
} from '../../utils/embed'

module.exports = class DocumentationAPICommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'lookup',
          type: 'string',
          prompt: 'what do you want to look up in the API docs?',
        },
      ],
      name: 'api',
      examples: [
        inlineCode('!api errorHandler'),
        inlineCode('!api Vue.observable'),
        inlineCode('!api observable'),
        inlineCode('!api computed'),
        inlineCode('!api template'),
        inlineCode('!api mounted'),
        inlineCode('!api directives'),
        inlineCode('!api mixins'),
        inlineCode('!api delimiters'),
        inlineCode('!api vm.$props'),
        inlineCode('!api vm.$watch'),
        inlineCode('!api vm.$on'),
        inlineCode('!api vm.$mount'),
        inlineCode('!api $props'),
        inlineCode('!api $watch'),
        inlineCode('!api $on'),
        inlineCode('!api $mount'),
        inlineCode('!api v-html'),
        inlineCode('!api ref'),
        inlineCode('!api keep-alive'),
      ],
      group: 'documentation',
      aliases: ['a'],
      guildOnly: false,
      memberName: 'api',
      description: 'Look something up in the API docs.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { lookup } = args

    let embed

    try {
      // Try to find an exact match (or alias).
      let api = getAPI(lookup)

      if (api) {
        embed = this.buildResponseEmbed(msg, api)
      } else {
        // Attempt a fuzzy search.
        api = findAPI(lookup)

        if (api) {
          if (api.length > 1) {
            return respondWithPaginatedEmbed(
              msg,
              this.buildDisambiguationEmbed(msg, lookup, api),
              api.map(item => this.buildResponseEmbed(msg, item))
            )
          } else if (api.length === 1) {
            embed = this.buildResponseEmbed(msg, api[0])
          }
        }
      }

      if (!api || api.length === 0) {
        throw new APINotFoundError(
          "Sorry, I couldn't find any matches for your query in the API docs."
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
      .setTitle(`API Lookup: ${inlineCode(lookup)}`)
      .setDescription(error.message)
      .setColor('RED')
  }

  buildDisambiguationEmbed(msg, lookup, results) {
    return createDefaultEmbed(msg)
      .setTitle(`API Lookup: ${inlineCode(lookup)}`)
      .setDescription(
        "Sorry, I couldn't find an exact match for your query in the API docs."
      )
      .addField(
        'Perhaps you meant one of these:',
        results.map(result => inlineCode(result.id)).join(', ')
      )
      .setColor('BLUE')
  }

  buildResponseEmbed(msg, api) {
    const embed = createDefaultEmbed(msg)
      .setURL(api.link)
      .setTitle(api.title)
      .setFooter(`Category: ${api.category}`)

    if (api.description) {
      embed.setDescription(api.description)
    }

    if (api.status) {
      embed.addField('Status', api.status)

      if (api.status === 'deprecated') {
        embed.setColor('ORANGE')
      } else if (api.status === 'removed') {
        embed.setColor('RED')
      }
    }

    if (api.type) {
      embed.addField('Type', inlineCode(api.type), true)
    }

    if (api.default) {
      embed.addField('Default', inlineCode(api.default), true)
    }

    if (api.version) {
      embed.addField('Since', api.version, true)
    }

    if (api.arguments) {
      embed.addField(
        'Arguments',
        api.arguments.map(arg => inlineCode(arg)).join('\n')
      )
    }

    if (api.usage && api.usage.lang && api.usage.code) {
      embed.addField('Usage', blockCode(api.usage.code, api.usage.lang))
    }

    if (api.see && api.see.length) {
      embed.addField('See Also', api.see.join('\n'))
    }

    return embed
  }
}
