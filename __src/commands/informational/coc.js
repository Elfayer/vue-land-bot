import { Command } from 'discord.js-commando'
import {
  respondWithPaginatedEmbed,
  createDefaultEmbed,
} from '../../utils/embed'
import coc from '../../../data/coc'
import { cleanupInvocation } from '../../utils/messages'
import { inlineCode } from '../../utils/string'

module.exports = class InfoCodeOfConductCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'member',
          type: 'member',
          prompt: 'who to DM the message to (optional)?',
          default: 'none',
        },
      ],
      name: 'coc',
      group: 'informational',
      examples: [
        inlineCode('!coc'),
        inlineCode('!coc user'),
        inlineCode('!coc @user#1234'),
      ],
      aliases: ['conduct'],
      guildOnly: true,
      memberName: 'coc',
      description: 'Show the Code of Conduct.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { member } = args

    let sendToChannel
    if (member === 'none') {
      sendToChannel = msg.channel
    } else {
      sendToChannel = await member.createDM()
      let response = await msg.reply(
        `okay, I sent ${member.displayName} a DM about that as requested.`
      )
      cleanupInvocation(response)
    }

    respondWithPaginatedEmbed(
      msg,
      null,
      coc.map(item => this.buildEmbed(msg, item)),
      [],
      { sendToChannel }
    )

    cleanupInvocation(msg)
  }

  buildEmbed(msg, entry) {
    const embed = createDefaultEmbed(msg, msg.argString)

    return embed
      .setURL('https://vuejs.org/coc/')
      .setTitle(`Code of Conduct - ${entry.title}`)
      .setDescription(entry.description)
  }
}
