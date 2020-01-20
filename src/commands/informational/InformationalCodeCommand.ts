import { KlasaMessage, CommandStore, Command, ReactionHandler } from 'klasa'
import { GuildMember, MessageEmbed } from 'discord.js'

import createVueTemplate from '@templates/VueTemplate'
import { RichDisplay } from 'klasa'

export default class InformationalCodeCommand extends Command {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'code',
      usage: '[member:member]',
      runIn: ['text', 'dm'],
      description: language => language.get('CMD_INFO_CODE_DESCRIPTION'),
      extendedHelp: language => language.get('CMD_INFO_CODE_EXTENDED_HELP'),
    })
  }

  /**
   * Show code highlighting tips.
   */
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

  /**
   * Create the RichDisplay, which consists of:
   *   - an "input" page, which shows how to input code
   *   - an "output" page, which shows how it looks
   *   - an information page, which explains things in slightly more detail
   */
  createDisplay(message: KlasaMessage): RichDisplay {
    const display = new RichDisplay(
      createVueTemplate(message)
        .setTitle(message.language.get('INFO_CODE_TITLE'))
        .setDescription(message.language.get('INFO_CODE_DESCRIPTION'))
    )

    display.setInfoPage(
      createVueTemplate(message).setDescription(
        message.language.get('INFO_CODE_INFO_PAGE_CONTENT')
      )
    )

    return display
      .addPage(
        createVueTemplate(message)
          .setTitle(message.language.get('INFO_CODE_TITLE_INPUT'))
          .addField(
            message.language.get('INFO_CODE_FIELD_NAME_INLINE'),
            message.language.get('INFO_CODE_FIELD_VALUE_INLINE')
          )
          .addField(
            message.language.get('INFO_CODE_FIELD_NAME_BLOCK'),
            message.language.get('INFO_CODE_FIELD_VALUE_BLOCK')
          )
      )
      .addPage(
        createVueTemplate(message)
          .setTitle(message.language.get('INFO_CODE_TITLE_OUTPUT'))
          .addField(
            message.language
              .get('INFO_CODE_FIELD_NAME_INLINE')
              .replace(/\\/g, ''),
            message.language
              .get('INFO_CODE_FIELD_VALUE_INLINE')
              .replace(/\\/g, '')
          )
          .addField(
            message.language
              .get('INFO_CODE_FIELD_NAME_BLOCK')
              .replace(/\\/g, ''),
            message.language
              .get('INFO_CODE_FIELD_VALUE_BLOCK')
              .replace(/\\/g, '')
          )
      )
  }
}
