import {
  KlasaMessage,
  CommandStore,
  RichDisplay,
  RichDisplayRunOptions,
} from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InfoCommand from '@structures/InfoCommand'
import { I18n } from '@libraries/types/I18n'

const {
  Cmd: {
    Info: { Code: Language },
  },
} = I18n

export default class InfoCodeCommand extends InfoCommand {
  richDisplayOptions: RichDisplayRunOptions = {
    jump: false,
    stop: false,
    firstLast: false,
  }

  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'code',
      description: language => language.get(Language.DESC),
      extendedHelp: language => language.get(Language.HELP),
    })
  }

  /**
   * Create the RichDisplay, which consists of:
   *   - an "input" page, which shows how to input code
   *   - an "output" page, which shows how it looks
   *   - an information page, which explains things in slightly more detail
   */
  createDisplay(message: KlasaMessage): RichDisplay {
    const display = new RichDisplay(createVueTemplate(message))

    display.setInfoPage(
      createVueTemplate(message).setDescription(
        message.language.get(Language.INFO_PAGE_CONTENT)
      )
    )

    return display
      .addPage(
        createVueTemplate(message)
          .setTitle(message.language.get(Language.TITLE_INPUT))
          .addField(
            message.language.get(Language.FIELD_NAME_INLINE),
            message.language.get(Language.FIELD_VALUE_INLINE)
          )
          .addField(
            message.language.get(Language.FIELD_NAME_BLOCK),
            message.language.get(Language.FIELD_VALUE_BLOCK)
          )
      )
      .addPage(
        createVueTemplate(message)
          .setTitle(message.language.get(Language.TITLE_OUTPUT))
          .addField(
            message.language.get(Language.FIELD_NAME_INLINE).replace(/\\/g, ''),
            message.language.get(Language.FIELD_VALUE_INLINE).replace(/\\/g, '')
          )
          .addField(
            message.language.get(Language.FIELD_NAME_BLOCK).replace(/\\/g, ''),
            message.language.get(Language.FIELD_VALUE_BLOCK).replace(/\\/g, '')
          )
      )
  }
}
