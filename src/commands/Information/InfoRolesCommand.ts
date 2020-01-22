import { KlasaMessage, CommandStore, RichDisplay } from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InfoCommand from '@structures/InfoCommand'
import { ROLES } from '@libraries/constants'
import { roleMention } from '@utilities/miscellaneous'
import { I18n } from '@libraries/types/I18n'

const {
  Cmd: {
    Info: { Roles: Language },
  },
} = I18n

export default class InfoRolesCommand extends InfoCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'roles',
      description: language => language.get(Language.DESC),
      extendedHelp: language => language.get(Language.HELP),
    })
  }

  /**
   * Create the RichDisplay, which consists of a page for each role with a brief explanation.
   */
  createDisplay(message: KlasaMessage, isDM: boolean): RichDisplay {
    const display = new RichDisplay(
      createVueTemplate(message).setTitle(message.language.get(Language.TITLE))
    )

    for (const role of Object.values(Language.ROLES_NAMES)) {
      console.log(
        isDM,
        Language.ROLES_FRIENDLY_NAMES[role],
        roleMention(ROLES[role])
      )
      display.addPage(
        createVueTemplate(message).setDescription(
          message.language.get(Language[`DESC_${role}`], [
            isDM
              ? Language.ROLES_FRIENDLY_NAMES[role]
              : roleMention(ROLES[role]),
          ])
        )
      )
    }

    return display
  }
}
