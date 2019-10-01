import { Command } from 'discord.js-commando'
import { getLibrary } from '../../services/libraries'
import { RichEmbed } from 'discord.js'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { tryDelete } from '../../utils/messages'
import { uppercaseFirst } from '../../utils/string'

const DELETE_ERRORS_AFTER = 30000

module.exports = class DocumentationLibraryCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'name',
          type: 'string',
          prompt: 'which library to look up?',
        },
      ],
      name: 'library',
      group: 'documentation',
      aliases: ['lib', 'l'],
      examples: [
        `!library quasar`,
        `!library vuetify`,
        `!library nuxt`,
        `!library gridsome`,
        `!library saber`,
        `!library vuepress`,
      ],
      guildOnly: false,
      memberName: 'library',
      description: 'Look up a library/framework by name.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { name } = args

    try {
      let library = getLibrary(name)
      const embed = this.buildResponseEmbed(library)

      return msg.channel.send(EMPTY_MESSAGE, { embed })
    } catch (error) {
      console.error(error)
      const embed = this.buildErrorEmbed(name)
      const response = await msg.channel.send(EMPTY_MESSAGE, { embed })

      tryDelete(msg)
      tryDelete(response, DELETE_ERRORS_AFTER)
    }
  }

  buildResponseEmbed(library) {
    const embed = new RichEmbed()
      .setURL(library.url.site)
      .setTitle(library.name)
      .setColor(library.colour)

    if (library.tagline) {
      embed.setDescription(library.tagline)
    }

    if (library.tags.length) {
      embed.setFooter('Tags: ' + library.tags.join(', '))
    }

    if (library.icon) {
      embed.setThumbnail(`attachment://${library.icon}`).attachFile({
        attachment: `assets/images/icons/${library.icon}`,
        name: library.icon,
      })
    }

    if (library.author) {
      embed.setAuthor(
        library.author.name,
        library.author.avatar,
        library.author.url
      )
    }

    if (library.fields) {
      for (const field of library.fields) {
        if (typeof field === 'object') {
          embed.addField(field.name, field.value)
        } else {
          embed.addField(EMPTY_MESSAGE, field)
        }
      }
    }

    for (const [name, url] of Object.entries(library.url)) {
      embed.addField(uppercaseFirst(name), url, true)
    }

    return embed
  }

  buildErrorEmbed(name) {
    return new RichEmbed()
      .setTitle('Library Lookup')
      .setColor('RED')
      .setDescription(
        `Could not find a library with the name: ${name}.\n\nThink it should be included?`
      )
      .addField('Submit PR', 'https://git.io/JenP0', true)
      .addField('File issue', 'https://git.io/JenP2', true)
  }
}
