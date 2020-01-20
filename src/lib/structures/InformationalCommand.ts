import {
  KlasaMessage,
  CommandStore,
  Command,
  ReactionHandler,
  CommandOptions,
  util,
} from 'klasa'
import { GuildMember, MessageEmbed } from 'discord.js'

import createVueTemplate from '@templates/VueTemplate'
import { RichDisplay } from 'klasa'

/**
 * Contains shared functionality for informational commands.
 */
export default abstract class InformationalCommand extends Command {
  constructor(
    store: CommandStore,
    file: string[],
    directory: string,
    options: CommandOptions
  ) {
    super(
      store,
      file,
      directory,
      util.mergeDefault(
        {
          usage: '[member:member]',
          description: language =>
            language.get(
              `CMD_INFO_${options.name.toLocaleUpperCase()}_DESCRIPTION`
            ),
          extendedHelp: language =>
            language.get(
              `CMD_INFO_${options.name.toLocaleUpperCase()}_EXTENDED_HELP`
            ),
        },
        options
      )
    )
  }

  async run(message: KlasaMessage, [member]: [GuildMember]) {
    try {
      if (member && message.guild?.members.find(member => member === member)) {
        const dm = await member.createDM()

        this.sendResponse(
          await dm.sendMessage('Loading...'),
          this.createDisplay(message)
        )

        const response = await message.sendLocale('VUEBOT_DM_SENT')
        message.delete({ timeout: 5000 })
        response.delete({ timeout: 5000 })
        return response
      } else {
        this.sendResponse(message, this.createDisplay(message))
      }
    } catch (error) {
      message.sendLocale('VUEBOT_GENERIC_ERROR')
      console.error(error)
    }
  }

  /**
   * Send the RichDisplay response.
   */
  sendResponse(
    message: KlasaMessage,
    response: RichDisplay
  ): Promise<ReactionHandler> {
    return response.run(message, {
      jump: false,
      stop: false,
      firstLast: false,
    })
  }

  abstract createDisplay(message: KlasaMessage): RichDisplay
}
