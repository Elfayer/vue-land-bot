import { RichEmbed } from 'discord.js'
import Job from '../lib/job'
import { banWords } from '../services/ban-words'
import {
  MODERATOR_ROLE_IDS,
  PROTECTED_ROLE_IDS,
  EMPTY_MESSAGE,
} from '../utils/constants'

export default class BanJob extends Job {
  constructor(client) {
    super(client, {
      name: 'ban',
      description: 'Automatically bans users who violate the banned word list.',
      enabled: false,
      ignored: {
        roles: [...MODERATOR_ROLE_IDS, ...PROTECTED_ROLE_IDS],
      },
      guildOnly: true,
      config: {
        logChannel: {
          name: 'ban-log',
        },
      },
    })
  }

  shouldExecute(msg) {
    // None of the ban words were mentioned - bail.
    if (
      !banWords.some(word =>
        msg.content.toLowerCase().includes(word.toLowerCase())
      )
    )
      return false

    // We don't have permission to ban - bail.
    if (!msg.channel.permissionsFor(msg.client.user).has('BAN_MEMBERS'))
      return false

    const botMember = msg.guild.member(msg.client.user)
    const botHighestRole = botMember.highestRole.calculatedPosition
    const userHighestRole = msg.member.highestRole.calculatedPosition

    // Our role is not high enough in the hierarchy to ban - bail.
    if (botHighestRole < userHighestRole) return false

    return true
  }

  run(msg) {
    const logChannel = msg.client.channels.find(
      channel => channel.name === this.config.logChannel.name
    )

    if (!logChannel)
      return console.warn(
        `WarnJob: Could not find channel with name ${this.config.logChannel.name}`
      )

    msg.member
      .ban(`[${msg.client.user.name}] Automated anti-spam measures.`)
      .then(() => {
        if (!logChannel)
          return console.log(
            `Banned user: ${msg.author}`,
            `Due to message: ${msg.cleanContent}`
          )

        const embed = new RichEmbed()
        embed.setTitle('Banned User')
        embed.setAuthor(msg.author, msg.author.avatarURL)
        embed.setTimestamp()
        embed.addField('Triggering Message', msg.content)

        logChannel.send(EMPTY_MESSAGE, { embed })
      })
      .catch(console.error) // Shouldn't happen due to shouldExecute checks but...
  }
}
