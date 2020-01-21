import {
  Command,
  CommandStore,
  CommandOptions,
  KlasaMessage,
  Language,
  ReactionHandler,
  RichDisplay,
  RichDisplayRunOptions,
  util,
} from 'klasa'
import { GuildMember } from 'discord.js'

/**
 * Contains shared functionality for informational commands.
 */
export default abstract class InformationalCommand extends Command {
  richDisplayOptions: RichDisplayRunOptions

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
          description: (language: Language) =>
            language.get(
              `CMD_INFO_${options.name.toLocaleUpperCase()}_DESCRIPTION`
            ),
          extendedHelp: (language: Language) =>
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
          await dm.sendMessage('\u200b'),
          this.createDisplay(message, true)
        )

        const response = await message.sendLocale('VUEBOT_DM_SENT')
        message.delete({ timeout: 5000 })
        response.delete({ timeout: 5000 })
        return response
      } else {
        this.sendResponse(
          message,
          this.createDisplay(message, message.channel.type === 'dm')
        )
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
    return response.run(message, this.richDisplayOptions)
  }

  abstract createDisplay(message: KlasaMessage, isDM: boolean): RichDisplay
}
