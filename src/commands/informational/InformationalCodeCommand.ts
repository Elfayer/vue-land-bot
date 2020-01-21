import {
  KlasaMessage,
  CommandStore,
  RichDisplay,
  RichDisplayRunOptions,
} from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InformationalCommand from '@structures/InformationalCommand'

export default class InformationalCodeCommand extends InformationalCommand {
  richDisplayOptions: RichDisplayRunOptions = {
    jump: false,
    stop: false,
    firstLast: false,
  }

  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, { name: 'code' })
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
