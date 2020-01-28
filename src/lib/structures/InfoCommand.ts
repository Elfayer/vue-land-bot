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
import { GuildMember, MessageEmbed } from 'discord.js'

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
    response: RichDisplay | MessageEmbed
  ): Promise<ReactionHandler | KlasaMessage> {
    if (response instanceof RichDisplay) {
      if (message.channel.type !== 'dm') {
        return response.run(message, this.richDisplayOptions)
      }

      response = this.restructureDisplayForDM(response)
    }

    return message.sendEmbed(response)
  }

  /**
   * RichDisplays in DMs are officially WONTFIX, so we need to do some juggling.
   */

  private restructureDisplayForDM(display: RichDisplay) {
    const response = display.template

    for (const page of display.pages) {
      response.addField(page.title ?? '\u200b', page.description ?? '\u200b')

      if (page.fields.length) {
        response.fields = [...response.fields, ...page.fields]
      }
    }

    return response
  }

  abstract createDisplay(
    message: KlasaMessage,
    isDM: boolean
  ): RichDisplay | MessageEmbed
}
