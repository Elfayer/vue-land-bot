import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import {
  DEFAULT_EMBED_COLOUR,
  respondWithPaginatedEmbed,
} from '../../utils/embed'
import coc from '../../../data/coc'

module.exports = class InfoCodeOfConductCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coc',
      group: 'miscellaneous',
      aliases: ['conduct'],
      guildOnly: false,
      memberName: 'coc',
      description: 'Show the Code of Conduct.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg) {
    return respondWithPaginatedEmbed(
      msg,
      null,
      coc.map(item => this.buildResponseEmbed(msg, item))
    )
  }

  buildResponseEmbed(msg, entry) {
    return new RichEmbed()
      .setColor(DEFAULT_EMBED_COLOUR)
      .setTitle(`Code of Conduct - ${entry.title}`)
      .setURL('https://vuejs.org/coc/')
      .setThumbnail('attachment://vue.png')
      .attachFile({
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      })
      .setDescription(entry.description)
  }
}
