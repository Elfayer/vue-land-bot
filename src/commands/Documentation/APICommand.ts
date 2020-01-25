import {
  KlasaMessage,
  Possible,
  RichDisplay,
  Command,
  CommandStore,
  ReactionHandler,
  util,
} from 'klasa'
import { MessageEmbed, MessageAttachment } from 'discord.js'

import DocService, { APIItem, LookupDisabledError } from '@services/DocService'
import createVueTemplate from '@templates/VueTemplate'
import { excerpt, inlineCode, blockCode } from '@utilities/miscellaneous'
import { APISettings } from '@settings/APISettings'
import { I18n } from '@libraries/types/I18n'

const {
  Cmd: {
    Docs: { API: Language },
  },
  Misc: LanguageMisc,
} = I18n

export default class APICommand extends Command {
  service: DocService

  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'api',
      aliases: ['a'],
      usage: '(query:query)',
      runIn: ['text'],
      description: language => language.get(Language.DESC),
      extendedHelp: language => language.get(Language.HELP),
      usageDelim: '',
    })

    this.service = this.client.services.get('DocService') as DocService

    this.createCustomResolver(
      'query',
      (
        argument: string,
        possible: Possible,
        message: KlasaMessage,
        [subcommand]: any[]
      ) => {
        // No query argument is required with these flags.
        if (message.flagArgs.dump || message.flagArgs.refresh) {
          return undefined
        }

        // The query is required - run the argument as a string.
        return this.client.arguments
          .get('string')!
          .run(argument, possible, message)
      }
    )
  }

  /**
   * Delegates to dump or search depending on flagArgs.
   */
  run(message: KlasaMessage, [query]: [string]) {
    if (message.flagArgs.dump) {
      return this.dump(message)
    }

    return this.search(message, query) as Promise<KlasaMessage>
  }

  /**
   * Search for API documentation via the DocService's Lunr index.
   */
  async search(message: KlasaMessage, query?: string) {
    try {
      const apis = await this.service.lookupAPI(message.guild, query)
      const response = this.buildResponse(message, apis, query)
      return this.sendResponse(message, response)
    } catch (error) {
      this.error(error)
      if (error instanceof LookupDisabledError) {
        return message.sendMessage(error.message)
      } else {
        return message.sendLocale(LanguageMisc.ERROR_GENERIC)
      }
    }
  }

  /**
   * Send the response MessageEmbed or run the response RichDisplay.
   */
  private sendResponse(
    message: KlasaMessage,
    response: MessageEmbed | RichDisplay
  ): Promise<KlasaMessage | ReactionHandler> {
    if (response instanceof MessageEmbed) {
      return message.sendEmbed(response)
    }

    return response.run(message, {
      filter(_reaction, user) {
        return user.id === message.author.id
      },
    })
  }

  /**
   * Build the response based on the passed API(s).
   */
  private buildResponse(
    message: KlasaMessage,
    apis: APIItem[],
    query: string
  ): MessageEmbed | RichDisplay {
    const template = createVueTemplate(message)

    if (apis.length === 0) {
      return template
        .setTitle(message.language.get(LanguageMisc.TITLE_NO_MATCHES))
        .setDescription(
          message.language.get(
            LanguageMisc.DESC_NO_MATCHES,
            message.command.name,
            query
          )
        )
    } else if (apis.length === 1) {
      return this.buildAPIPage(apis[0], template, message)
    }

    const display = new RichDisplay(template)

    for (const api of apis) {
      display.addPage((embed: MessageEmbed) =>
        this.buildAPIPage(api, embed, message)
      )
    }

    display.setInfoPage(
      createVueTemplate(message)
        .setTitle(message.language.get(Language.INFO_PAGE_TITLE))
        .setDescription(message.language.get(Language.INFO_PAGE_DESC))
    )

    return display
  }

  /**
   * Build a single API page.
   */
  private buildAPIPage(
    api: APIItem,
    embed: MessageEmbed,
    message: KlasaMessage
  ) {
    embed.setURL(api.link).setTitle(api.title)

    if (api.description) {
      embed.setDescription(api.description)
    }

    if (message.flagArgs.short) {
      embed.description = excerpt(embed.description, 31)
      return embed
    }

    embed.addField('Category', api.category, true)

    if (api.status) {
      embed.addField('Status', api.status, true)

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

    if (Array.isArray(api.arguments) && api.arguments.length) {
      // Method has multiple signatures...
      if (Array.isArray(api.arguments[0])) {
        for (const signature of api.arguments) {
          embed.addField(
            'Signature',
            blockCode((signature as string[]).join('\n'), 'ts')
          )
        }
      } else {
        embed.addField(
          'Arguments',
          blockCode((api.arguments as string[]).join('\n'), 'ts')
        )
      }
    }

    if (api.usage && api.usage.lang && api.usage.code) {
      embed.addField('Usage', blockCode(api.usage.code, api.usage.lang))
    }

    if (api.see && api.see.length) {
      embed.addField(
        'See Also',
        api.see.map(({ text, link }) => `[${text}](${link})`).join('\n')
      )
    }

    return embed
  }

  /**
   * Dump the API data to a JSON file, primarily for debugging purposes.
   *
   * Flags
   *
   *   * `--pretty` - format the output
   *   * `--only=vue|vuex` - filter down to specific APIs
   */
  dump(message: KlasaMessage) {
    if (!message.member?.hasPermission('ADMINISTRATOR')) {
      throw message.language.get(LanguageMisc.ERROR_PERM_USER, [
        ['`ADMINISTRATOR`'],
      ])
    }

    if (
      !message.guild.members
        .get(this.client.user.id)
        .hasPermission('ATTACH_FILES')
    ) {
      throw message.language.get(LanguageMisc.ERROR_PERM_BOT, [
        ['`ATTACH_FILES`'],
      ])
    }

    try {
      const apis = this.service.getAPIs(message.flagArgs.only)
      const data = JSON.stringify(
        apis,
        null,
        Boolean(message.flagArgs.pretty) ? 2 : 0
      )

      return message.sendMessage(
        new MessageAttachment(Buffer.from(data, 'utf8'), 'apis.json')
      )
    } catch (error) {
      console.error(error)
      return message.sendLocale(LanguageMisc.ERROR_GENERIC)
    }
  }
}
