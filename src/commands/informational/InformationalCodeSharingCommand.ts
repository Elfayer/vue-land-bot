import { KlasaMessage, CommandStore, RichDisplay } from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InformationalCommand from '@structures/InformationalCommand'
import { URLS } from '@libraries/constants'

export default class InformationalCodeOfConductCommand extends InformationalCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, { name: 'sharing' })
  }

  /**
   * Create the RichDisplay, which consists of a page for each sharing heading.
   */
  createDisplay(message: KlasaMessage): RichDisplay {
    const display = new RichDisplay(createVueTemplate(message))

    for (const section of Object.values(SECTION_NAMES)) {
      display.addPage(
        createVueTemplate(message)
          .setTitle(message.language.get(`INFO_SHARING_TITLE_${section}`))
          .setDescription(message.language.get(`INFO_SHARING_DESC_${section}`))
          .setURL(URLS[section])
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
