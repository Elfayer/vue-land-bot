import { KlasaMessage, CommandStore, RichDisplay } from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InfoCommand from '@structures/InfoCommand'
import { MessageEmbed } from 'discord.js'
import { I18n } from '@libraries/types/I18n'

const {
  Cmd: {
    Info: { DRY: Language },
  },
} = I18n

export default class InfoDRYCommand extends InfoCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'dry',
      description: language => language.get(Language.DESC),
      extendedHelp: language => language.get(Language.HELP),
    })
  }

  createDisplay(message: KlasaMessage): RichDisplay | MessageEmbed {
    return createVueTemplate(message)
      .setTitle(message.language.get(Language.TITLE))
      .setDescription(message.language.get(Language.BODY))
  }
}
