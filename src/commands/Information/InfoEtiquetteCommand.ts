import {
  KlasaMessage,
  CommandStore,
  RichDisplay,
  RichDisplayRunOptions,
} from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InfoCommand from '@structures/InfoCommand'
import { I18n, EtiquetteSections } from '@libraries/types/I18n'

const {
  Cmd: {
    Info: { Etiquette: Language },
  },
} = I18n

export default class InfoEtiquetteCommand extends InfoCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'etiquette',
      description: language => language.get(Language.DESC),
      extendedHelp: language => language.get(Language.HELP),
    })
  }

  /**
   * Create the RichDisplay, which consists of a page for each etiquette heading.
   */
  createDisplay(message: KlasaMessage): RichDisplay {
    const display = new RichDisplay(createVueTemplate(message))

    for (const section of Object.values(EtiquetteSections)) {
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
  JSFIDDLE = 'JSFIDDLE',
  CODESANDBOX = 'CODESANDBOX',
  CODEPEN = 'CODEPEN',
  GIST = 'GIST',
}
