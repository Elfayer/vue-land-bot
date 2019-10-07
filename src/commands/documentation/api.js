import { Command } from 'discord.js-commando'
import { getAPI } from '../../services/api'
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
          prompt: 'What do you want to look up in the API docs?',
        },
      ],
      name: 'api',
      examples: [
        '!api errorHandler',
        '!api Vue.observable',
        '!api observable',
        '!api computed',
        '!api template',
        '!api mounted',
        '!api directives',
        '!api mixins',
        '!api delimiters',
        '!api vm.$props',
        '!api vm.$watch',
        '!api vm.$on',
        '!api vm.$mount',
        '!api $props',
        '!api $watch',
        '!api $on',
        '!api $mount',
        '!api v-html',
        '!api ref',
        '!api keep-alive',
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

    try {
      const api = getAPI(lookup)
      msg.channel
        .send(EMPTY_MESSAGE, {
          embed: this.buildResponseEmbed(msg, api),
        })
        .then(() => tryDelete(msg))
    } catch (error) {
      msg.channel
        .send(EMPTY_MESSAGE, {
          embed: this.buildErrorEmbed(msg, lookup),
        })
        .then(res => {
          tryDelete(msg)
          tryDelete(res, 15000)
        })
    }
  }

  buildErrorEmbed(msg, lookup) {
    return new RichEmbed()
      .setTitle('API Lookup')
      .setDescription(`Could not find a library matching "${lookup}".`)
      .setAuthor(
        msg.member ? msg.member.displayName : msg.author.username,
        msg.author.avatarURL
      )
      .setColor('RED')
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

    return embed
  }
}
