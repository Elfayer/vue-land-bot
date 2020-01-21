import {
  KlasaMessage,
  CommandStore,
  RichDisplay,
  RichDisplayRunOptions,
} from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InfoCommand from '@structures/InfoCommand'
import { URLS } from '@libraries/constants'

export default class InfoCodeOfConductCommand extends InfoCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, { name: 'coc' })
  }

  /**
   * Create the RichDisplay, which consists of a page for each CoC heading.
   *
   * @see https://vuejs.org/coc/
   */
  createDisplay(message: KlasaMessage): RichDisplay {
    const display = new RichDisplay(
      createVueTemplate(message)
        .setTitle(message.language.get('INFO_COC_TITLE'))
        .setURL(URLS.COC)
    )

    for (const section of Object.values(SECTION_NAMES)) {
      display.addPage(
        createVueTemplate(message)
          .setTitle(message.language.get(`INFO_COC_TITLE_${section}`))
          .setDescription(message.language.get(`INFO_COC_DESC_${section}`))
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
