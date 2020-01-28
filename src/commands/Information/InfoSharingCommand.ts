import { KlasaMessage, CommandStore, RichDisplay } from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InfoCommand from '@structures/InfoCommand'
import { URLS } from '@libraries/constants'
import { I18n, SharingSections } from '@libraries/types/I18n'

const {
  Cmd: {
    Info: { Sharing: Language },
  },
} = I18n

export default class InfoSharingCommand extends InfoCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'sharing',
      description: language => language.get(Language.DESC),
      extendedHelp: language => language.get(Language.HELP),
    })
  }

  /**
   * Create the RichDisplay, which consists of a page for each sharing heading.
   */
  createDisplay(message: KlasaMessage): RichDisplay {
    const display = new RichDisplay(createVueTemplate(message))

    for (const section of Object.values(SharingSections)) {
      display.addPage(
        createVueTemplate(message)
          .setTitle(message.language.get(Language[`TITLE_${section}`]))
          .setDescription(message.language.get(Language[`DESC_${section}`]))
          .setURL(URLS[section])
      )
    }

    return display
  }
}
