import { KlasaMessage, CommandStore, RichDisplay } from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InformationalCommand from '@structures/InformationalCommand'
import { ROLES } from '@libraries/constants'
import { ROLES_NAMES, ROLES_FRIENDLY_NAMES } from '@libraries/types/roles'
import { roleMention } from '@utilities/miscellaneous'

export default class InformationalCodeCommand extends InformationalCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, { name: 'roles' })
  }

  /**
   * Create the RichDisplay, which consists of a page for each role with a brief explanation.
   */
  createDisplay(message: KlasaMessage, isDM: boolean): RichDisplay {
    const display = new RichDisplay(
      createVueTemplate(message).setTitle(
        message.language.get('INFO_ROLES_TITLE')
      )
    )

    for (const role of Object.values(ROLES_NAMES)) {
      display.addPage(
        createVueTemplate(message).setDescription(
          message.language.get(`INFO_ROLES_ROLE_${role}_DESCRIPTION`, [
            isDM ? ROLES_FRIENDLY_NAMES[role] : roleMention(ROLES[role]),
          ])
        )
      )
    }

    return display
  }
}
