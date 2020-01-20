// import { User, Message, GuildMember, Guild } from 'discord.js'
import { KlasaMessage, Possible, Command, CommandStore } from 'klasa'
// import createVueTemplate from '@templates/VueTemplate'

export default class RFCCommand extends Command {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'rfc',
      usage: '<list|refresh|view:default> (query:query)',
      runIn: ['text', 'dm'],
      description: 'View Requests for Comments.',
      subcommands: true,
      usageDelim: ' ',
    })

    this.createCustomResolver(
      'query',
      (
        argument: string,
        possible: Possible,
        message: KlasaMessage,
        [subcommand]: any[]
      ) => {
        if (subcommand === 'list' || subcommand === 'refresh') {
          return undefined
        }

        return this.client.arguments
          .get('string')!
          .run(argument, possible, message)
      }
    )
  }

  /**
   * List all RFCs.
   */
  list(message: KlasaMessage) {
    return message.sendLocale('RFCS_LIST')
  }

  /**
   * Search for one or more RFCs.
   */
  view(message: KlasaMessage, [query]: [string]) {
    return message.sendLocale('RFCS_VIEW', [query])
  }

  /**
   * Refresh the RFCs from Github.
   */
  refresh(message: KlasaMessage) {
    return message.sendLocale('RFCS_REFRESH')
  }
}
