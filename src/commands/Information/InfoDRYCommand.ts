import { KlasaMessage, CommandStore, RichDisplay } from 'klasa'

import createVueTemplate from '@templates/VueTemplate'
import InfoCommand from '@structures/InfoCommand'
import { MessageEmbed } from 'discord.js'

export default class InfoDRYCommand extends InfoCommand {
  constructor(store: CommandStore, file: string[], directory: string) {
    super(store, file, directory, { name: 'dry' })
  }

  createDisplay(message: KlasaMessage): RichDisplay | MessageEmbed {
    return createVueTemplate(message)
      .setTitle(message.language.get('INFO_DRY_TITLE'))
      .setDescription(message.language.get('INFO_DRY_DESC'))
  }
}
