import {
  KlasaMessage,
  CommandStore,
  RichDisplay,
  RichDisplayRunOptions,
} from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InfoCommand from '@structures/InfoCommand'
import { URLS } from '@libraries/constants'
import { I18n } from '@libraries/types/I18n'

const {
  Cmd: {
    Info: { CoC: Language },
  },
} = I18n

export default class InfoCodeOfConductCommand extends InfoCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'coc',
      description: language => language.get(Language.DESC),
      extendedHelp: language => language.get(Language.HELP),
    })
  }

  /**
   * Create the RichDisplay, which consists of a page for each CoC heading.
   *
   * @see https://vuejs.org/coc/
   */
  createDisplay(message: KlasaMessage): RichDisplay {
    const display = new RichDisplay(
      createVueTemplate(message)
        .setTitle(message.language.get(Language.TITLE))
        .setURL(URLS.COC)
    )

    for (const section of Object.values(SECTION_NAMES)) {
      display.addPage(
        createVueTemplate(message)
          .setTitle(message.language.get(Language[`TITLE_${section}`]))
          .setDescription(message.language.get(Language[`DESC_${section}`]))
      )
    }

    return display
  }
}

export enum SECTION_NAMES {
  PLEDGE = 'PLEDGE',
  STANDARDS = 'STANDARDS',
  RESPONSIBILITIES = 'RESPONSIBILITIES',
  SCOPE = 'SCOPE',
  ENFORCEMENT = 'ENFORCEMENT',
  ATTRIBUTION = 'ATTRIBUTION',
}
