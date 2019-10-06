import { Command } from 'discord.js-commando'
import { getLibrary, findPossibleMatches } from '../../services/libraries'
import { RichEmbed } from 'discord.js'
import { EMPTY_MESSAGE } from '../../utils/constants'
import { tryDelete } from '../../utils/messages'
import { uppercaseFirst } from '../../utils/string'

const DELETE_MESSAGES_AFTER = 7500
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

      await msg.channel.send(EMPTY_MESSAGE, { embed })
      tryDelete(msg, DELETE_MESSAGES_AFTER)
    } catch (error) {
      const matches = findPossibleMatches(name)

      if (matches.length) {
        const embed = this.buildDisambiguationEmbed(name, matches)
        const response = await msg.channel.send(EMPTY_MESSAGE, { embed })

        tryDelete(msg, DELETE_MESSAGES_AFTER)
        tryDelete(response, DELETE_ERRORS_AFTER)
      } else {
        const embed = this.buildErrorEmbed(name)
        const response = await msg.channel.send(EMPTY_MESSAGE, { embed })

        tryDelete(msg, DELETE_MESSAGES_AFTER)
        tryDelete(response, DELETE_ERRORS_AFTER)
      }
    }
  }

  buildDisambiguationEmbed(name, matches) {
    let matchingNames = matches.map(match => '`' + match.name + '`').join(', ')

    // Don't overwhelm the user with information.
    if (matchingNames.length >= 15) {
      matchingNames = matchingNames.slice(0, 15)
    }

    return new RichEmbed()
      .setTitle('Library Lookup')
      .setColor('ORANGE')
      .setDescription(
        `Could not find library \`${name}\`, did you mean one of these:\n\n${matchingNames}?`
      )
  }

  buildResponseEmbed(library) {
    const embed = new RichEmbed()
      .setTitle(uppercaseFirst(library.name))
      .setColor(library.colour)

    if (library.links.site) {
      embed.setURL(library.links.site)
    } else {
      embed.setURL(library.links.repo)
    }

    if (library.description) {
      embed.setDescription(library.description)
    }

    if (library.topics.length) {
      embed.setFooter('Tags: ' + library.topics.join(', '))
    }

    if (library.icon) {
      embed.setThumbnail(`attachment://${library.icon}`).attachFile({
        attachment: `assets/images/icons/${library.icon}`,
        name: library.icon,
      })
    }

    if (library.organization) {
      embed.setAuthor(
        library.organization.login,
        library.organization.avatar_url
      )
    } else {
      embed.setAuthor(library.owner.login, library.owner.avatar_url)
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

    for (const [name, url] of Object.entries(library.links)) {
      if (url !== null) {
        embed.addField(uppercaseFirst(name), url)
      }
    }

    if (library.license) {
      embed.addField('License', library.license.name, true)
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
