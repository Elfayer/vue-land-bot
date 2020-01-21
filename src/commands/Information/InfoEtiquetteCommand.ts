import {
  KlasaMessage,
  CommandStore,
  RichDisplay,
  RichDisplayRunOptions,
} from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InfoCommand from '@structures/InfoCommand'

export default class InfoEtiquetteCommand extends InfoCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, { name: 'etiquette' })
  }

  /**
   * Create the RichDisplay, which consists of a page for each etiquette heading.
   */
  createDisplay(message: KlasaMessage): RichDisplay {
    const display = new RichDisplay(createVueTemplate(message))

    for (const section of Object.values(SECTION_NAMES)) {
      display.addPage(
        createVueTemplate(message)
          .setTitle(message.language.get(`INFO_ETIQUETTE_TITLE_${section}`))
          .setDescription(
            message.language.get(`INFO_ETIQUETTE_DESC_${section}`)
          )
      )
    }

    return display
  }
}

export enum SECTION_NAMES {
  JSFIDDLE = 'JSFIDDLE',
  CODESANDBOX = 'CODESANDBOX',
  CODEPEN = 'CODEPEN',
  GIST = 'GIST',
}