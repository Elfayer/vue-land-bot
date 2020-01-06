import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { tryDelete } from '../../utils/messages'
import { DEFAULT_EMBED_COLOUR } from '../../utils/embed'
import { oneLine } from 'common-tags'

module.exports = class InfoDontRepeatYourselfCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'dry',
      args: [
        {
          key: 'user',
          type: 'member',
          prompt: 'who to DM the message to (optional)?',
          default: 'none',
        },
      ],
      group: 'informational',
      guildOnly: true,
      memberName: 'dry',
      description:
        'Inform a member about the etiquette regarding copy-pasting messages.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { user } = args

    const codeHelpChannel =
      msg.client.channels.find(channel => channel.name === 'code-help') ||
      '#code-help'

    const embed = new RichEmbed()
      .setColor(DEFAULT_EMBED_COLOUR)
      .setTitle("Please don't repeat yourself")
      .setThumbnail('attachment://vue.png')
      .attachFile({
        attachment: 'assets/images/icons/vue.png',
        name: 'vue.png',
      })
      .setDescription(
        oneLine`
          When you copy-paste your question in multiple channels, it just leads to duplicated efforts.

          One person might have already answered your question in the first channel.

          Meanwhile, someone in another channel sees your unanswered question and wastes their time answering it.

          If you're not sure where to post your question, just ask. Otherwise, ${codeHelpChannel} is always a safe bet!
        `
      )

    if (user === 'none') {
      await msg.channel.send(embed)
    } else {
      try {
        user.send(embed)
      } catch (e) {
        console.error(e)
      }
    }

    tryDelete(msg)
  }
}
