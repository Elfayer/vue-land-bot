import { Command } from 'discord.js-commando'
import { getAPI, findAPI } from '../../services/api'
import { RichEmbed } from 'discord.js'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { inlineCode } from '../../utils/string'
import { tryDelete } from '../../utils/messages'
import { DEFAULT_EMBED_COLOUR } from '../../utils/embed'

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
            embed = this.buildDisambiguationEmbed(msg, lookup, api)
          } else if (api.length === 1) {
            embed = this.buildResponseEmbed(msg, api[0])
          }
        }
      }

      if (!api || api.length === 0) {
        embed = this.buildErrorEmbed(
          msg,
          lookup,
          new Error(`Could not find anything in the API matching "${lookup}".`)
        )
      }

      await msg.channel.send(EMPTY_MESSAGE, { embed })
      tryDelete(msg, 5000)
    } catch (error) {
      console.error(error)
      const reply = await msg.channel.send(EMPTY_MESSAGE, {
        embed: this.buildErrorEmbed(
          msg,
          lookup,
          new Error('An unexpected error occured.')
        ),
      })
      tryDelete(msg)
      tryDelete(reply, 15000)
    }
  }

  buildErrorEmbed(msg, lookup, error) {
    return new RichEmbed()
      .setTitle('API Lookup')
      .setDescription(error.message)
      .setAuthor(
        msg.member ? msg.member.displayName : msg.author.username,
        msg.author.avatarURL
      )
      .setColor('RED')
  }

  buildDisambiguationEmbed(msg, lookup, results) {
    return new RichEmbed()
      .setTitle(`API Lookup - ${lookup}`)
      .setDescription(
        `I couldn't find that but perhaps you meant one of these:\n\n${results
          .map(result => inlineCode('!api ' + result.id))
          .join('\n')}`
      )
      .setAuthor(
        msg.member ? msg.member.displayName : msg.author.username,
        msg.author.avatarURL
      )
      .setColor('BLUE')
  }

  buildResponseEmbed(msg, api) {
    const embed = new RichEmbed()
      .setTitle(api.title)
      .setAuthor(
        msg.member ? msg.member.displayName : msg.author.username,
        msg.author.avatarURL
      )
      .setURL(api.link)
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
    } else {
      embed.setColor(DEFAULT_EMBED_COLOUR)
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

    if (api.see && api.see.length) {
      embed.addField('See Also', api.see.join('\n'))
    }

    if (api.usage) {
      embed.addField('Usage', '```js\n' + api.usage.trim() + '\n```')
    }

    return embed
  }
}
