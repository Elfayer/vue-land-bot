import { Command } from 'discord.js-commando'
import { RichEmbed } from 'discord.js'
import { cleanupInvocation } from '../../utils/messages'
import { DEFAULT_EMBED_COLOUR } from '../../utils/embed'
import { inlineCode } from '../../utils/string'
import { oneLine } from 'common-tags'

module.exports = class InfoDontRepeatYourselfCommand extends Command {
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
      name: 'dry',
      group: 'informational',
      examples: [
        inlineCode('!dry'),
        inlineCode('!dry user'),
        inlineCode('!dry @user#1234'),
      ],
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
      .setAuthor(
        (msg.member ? msg.member.displayName : msg.author.username) +
          ' requested:',
        msg.author.avatarURL
      )
      .setDescription(
        oneLine`
          When you copy-paste your question in multiple channels, it just leads to duplicated efforts.

          One person might have already answered your question in the first channel.

          Meanwhile, someone in another channel sees your unanswered question and wastes their time answering it.

          If you're not sure where to post your question, just ask. Otherwise, ${codeHelpChannel} is always a safe bet!
        `
      )

    await sendToChannel.send(embed)

    cleanupInvocation(msg)
  }
}
