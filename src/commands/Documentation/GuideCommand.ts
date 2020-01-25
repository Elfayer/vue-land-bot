import {
  KlasaMessage,
  Possible,
  RichDisplay,
  Command,
  CommandStore,
  ReactionHandler,
} from 'klasa'
import { MessageEmbed, MessageAttachment } from 'discord.js'

import DocService, {
  GuideItem,
  LookupDisabledError,
} from '@services/DocService'
import createVueTemplate from '@templates/VueTemplate'
import { excerpt, inlineCode, blockCode } from '@utilities/miscellaneous'
import { I18n } from '@libraries/types/I18n'

const {
  Cmd: {
    Docs: { Guide: Language },
  },
  Misc: LanguageMisc,
} = I18n

export default class GuideCommand extends Command {
  service: DocService

  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'guide',
      aliases: ['g', 'docs', 'd'],
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
   * Search for guide documentation via the DocService's Lunr index.
   */
  async search(message: KlasaMessage, query?: string) {
    try {
      const guides = await this.service.lookupGuide(message.guild, query)
      this.debug(guides)
      const response = this.buildResponse(message, guides, query)
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
   * Build the response based on the passed guide(s).
   */
  private buildResponse(
    message: KlasaMessage,
    guides: GuideItem[],
    query: string
  ): MessageEmbed | RichDisplay {
    const template = createVueTemplate(message)

    if (guides.length === 0) {
      return template
        .setTitle(message.language.get(LanguageMisc.TITLE_NO_MATCHES))
        .setDescription(
          message.language.get(
            LanguageMisc.DESC_NO_MATCHES,
            message.command.name,
            query
          )
        )
    } else if (guides.length === 1) {
      return this.buildGuidePage(guides[0], template, message)
    }

    const display = new RichDisplay(template)

    for (const guide of guides) {
      display.addPage((embed: MessageEmbed) =>
        this.buildGuidePage(guide, embed, message)
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
  private buildGuidePage(
    guide: GuideItem,
    embed: MessageEmbed,
    message: KlasaMessage
  ) {
    embed.setURL(guide.link).setTitle(guide.title)

    if (guide.description) {
      embed.setDescription(guide.description)
    }

    if (message.flagArgs.short) {
      embed.description = excerpt(embed.description, 31)
      return embed
    }

    embed.addField('Category', guide.category, true)

    if (guide.see && guide.see.length) {
      embed.addField(
        'See Also',
        guide.see.map(({ text, link }) => `[${text}](${link})`).join('\n')
      )
    }

    return embed
  }

  /**
   * Dump the guide data to a JSON file, primarily for debugging purposes.
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
      const guides = this.service.getGuides(message.flagArgs.only)
      const data = JSON.stringify(
        guides,
        null,
        Boolean(message.flagArgs.pretty) ? 2 : 0
      )

      return message.sendMessage(
        new MessageAttachment(Buffer.from(data, 'utf8'), 'guides.json')
      )
    } catch (error) {
      console.error(error)
      return message.sendLocale(LanguageMisc.ERROR_GENERIC)
    }
  }
}
