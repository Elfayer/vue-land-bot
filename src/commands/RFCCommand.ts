import {
  KlasaMessage,
  Possible,
  RichDisplay,
  Command,
  CommandStore,
} from 'klasa'
import { MessageEmbed, MessageAttachment } from 'discord.js'
import { PullsListResponseItem } from '@octokit/rest'

import { PATHS } from '@libraries/constants'
import RFCService, { PullRequestState } from '@base/services/RFCService'
import createVueTemplate from '@templates/VueTemplate'

export default class RFCCommand extends Command {
  service: RFCService

  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'rfc',
      usage: '<list|refresh|default:default> (query:query)',
      runIn: ['text', 'dm'],
      description: language => language.get('RFCS_COMMAND_DESCRIPTION'),
      extendedHelp: language => language.get('RFCS_COMMAND_EXTENDED_HELP'),
      subcommands: true,
      usageDelim: ' ',
    })

    this.service = this.client.services.get('RFCService') as RFCService

    this.customizeResponse('query', message =>
      message.language.get('RFCS_ARGUMENT_QUERY', [this.client.options.prefix])
    )

    this.createCustomResolver(
      'query',
      (
        argument: string,
        possible: Possible,
        message: KlasaMessage,
        [subcommand]: any[]
      ) => {
        // No query argument is required for these sub-commands.
        if (subcommand === 'list' || subcommand === 'refresh') {
          return undefined
        }

        // No query argument is required when dumping RFC JSON via --dump.
        if (message.flagArgs.dump) {
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
   * By default lists all RFCs but accepts a --state flag argument.
   *
   * @see PullRequestState Valid states to filter by.
   */
  async list(message: KlasaMessage) {
    try {
      const filter: PullRequestState =
        (message.flagArgs.state as PullRequestState) || PullRequestState.ALL

      if (!(filter.toUpperCase() in PullRequestState)) {
        return message.sendLocale('RFC_LIST_INVALID_FILTER', [
          filter,
          Object.keys(PullRequestState)
            .map(key => PullRequestState[key])
            .join(', '),
        ])
      }

      const rfcs = await this.service.getRFCsByState(filter)
      const response = this.buildResponse(message, rfcs)
      return this.sendResponse(message, response)
    } catch (error) {
      this.client.console.error(error)
      return message.sendLocale('RFCS_LIST_ERROR')
    }
  }

  /**
   * Refresh the RFCs from Github.
   */
  async refresh(message: KlasaMessage) {
    if (!message.member?.hasPermission('ADMINISTRATOR')) {
      throw message.language.get('RFCS_REFRESH_LACKING_PERMISSION')
    }

    try {
      await this.service.cacheRFCs(true)
      return message.sendLocale('RFCS_REFRESH_SUCCESS', [
        this.service.getCacheTTLHuman(),
      ])
    } catch (error) {
      return message.sendLocale('RFCS_REFRESH_FAILURE')
    }
  }

  /**
   *
   */
  default(message: KlasaMessage, [query]: [string]) {
    if (message.flagArgs.dump) {
      return this.dump(message)
    }

    return message.sendLocale('RFCS_VIEW', [query])
  }

  /**
   * Dump the RFC-related settings, for debugging purposes.
   */
  dump(message: KlasaMessage) {
    if (
      message.channel.type !== 'dm' &&
      message.guild.members
        .get(this.client.user.id)
        .hasPermission('ATTACH_FILES')
    ) {
      throw message.language.get('RFCS_DUMP_CLIENT_LACKS_PERMISSIONS')
    }

    const pretty = message.flagArgs.pretty
    const data = JSON.stringify(
      this.client.settings.get('rfcs'),
      null,
      pretty ? 2 : 0
    )

    return message.sendMessage(
      new MessageAttachment(Buffer.from(data, 'utf8'), 'rfcs.json')
    )
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
   * Build the response based on the passed RFC(s).
   */
  private buildResponse(
    message: KlasaMessage,
    rfcs: PullsListResponseItem[]
  ): MessageEmbed | RichDisplay {
    const template = createVueTemplate(message)

    if (rfcs.length === 0) {
      return template
        .setTitle(message.language.get('RFCS_NO_MATCHS_TITLE'))
        .setDescription(message.language.get('RFCS_NO_MATCHS_DESCRIPTION'))
    } else if (rfcs.length === 1) {
      return this.buildRFCPage(rfcs[0], template, message)
    }

    const display = new RichDisplay(template)

    for (const rfc of rfcs) {
      display.addPage((embed: MessageEmbed) =>
        this.buildRFCPage(rfc, embed, message)
      )
    }

    display.setInfoPage(
      createVueTemplate(message)
        .setTitle(message.language.get('RFCS_INFO_PAGE_TITLE'))
        .setDescription(message.language.get('RFCS_INFO_PAGE_DESCRIPTION'))
    )

    return display
  }

  /**
   * Build a single RFC page.
   */
  private buildRFCPage(
    rfc: PullsListResponseItem,
    embed: MessageEmbed,
    message: KlasaMessage
  ) {
    embed.setURL(rfc.html_url).setTitle(`RFC #${rfc.number} - ${rfc.title}`)

    if (!message.flagArgs.short) {
      embed
        .setDescription(rfc.body.substring(0, 2040))
        .addField('Author', rfc.user.login, true)
        .addField('Status', rfc.state, true)

      if (rfc.labels.length) {
        embed.addField(
          'Labels',
          rfc.labels.map(label => label.name).join(', '),
          true
        )
      }

      if (rfc.created_at) {
        embed.addField(
          'Created',
          new Date(rfc.created_at).toLocaleDateString(),
          true
        )
      }

      if (rfc.updated_at) {
        embed.addField(
          'Updated',
          new Date(rfc.updated_at).toLocaleDateString(),
          true
        )
      }

      let labelsWithColours = rfc.labels.filter(label =>
        ['core', 'vuex', 'router'].includes(label.name)
      )

      if (labelsWithColours.length) {
        embed.setColor(`#${labelsWithColours[0].color}`)
      }
    }

    return embed
  }
}
