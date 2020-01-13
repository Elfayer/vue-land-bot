import { Command } from 'discord.js-commando'
import { inlineCode } from '../../utils/string'
import { cleanupInvocation } from '../../utils/messages'
import { createDefaultEmbed } from '../../utils/embed'
import { ANNOUNCEMENT_CHANNEL } from '../../services/version-checker'

let _interval
let _duration

module.exports = class AnnouncementsScheduleCommand extends Command {
  constructor(client) {
    super(client, {
      args: [
        {
          key: 'duration',
          type: 'integer',
          prompt: 'how often to check for new releases, in hours?',
          validate(value) {
            return value >= 0 && value <= 24 * 7
          },
          default: 12,
        },
      ],
      name: 'schedule',
      aliases: ['schedule-release', 'schedule-releases'],
      examples: [inlineCode('!schedule 3')],
      group: 'announcements',
      guildOnly: true,
      memberName: 'schedule',
      description:
        'Schedule automated announcements of new releases for Vue.js repositories.',
    })
  }

  hasPermission() {
    return true
  }

  async run(msg, args) {
    const { duration } = args

    const announceChannel = msg.guild.channels.find(
      channel =>
        channel.name.toLowerCase() === ANNOUNCEMENT_CHANNEL.toLowerCase()
    )

    let embed

    try {
      if (duration === 0) {
        clearInterval(_interval)
        embed = createDefaultEmbed(msg)
          .setTitle('Automated Release == Notifications')
          .setDescription('Okay, I cleared the schedule for you.')
      } else {
        if (_interval) {
          clearInterval(_interval)
        }

        _interval = setInterval(() => {
          this.client.registry.commands
            .get('release')
            .run(msg, { repo: 'all', automated: true })
        }, 1000 * 60 * 60 * duration)

        embed = createDefaultEmbed(msg).setTitle(
          'Automated Release Notifications'
        )

        let description
        if (_duration) {
          description = ['Okay, I updated the schedule for you.']
          embed
            .addField('Before', `${_duration} hours`, true)
            .addField('After', `${duration} hours`, true)
        } else {
          description = [
            `Okay, I set the schedule to ${duration} hours for you.`,
          ]
        }
        description.push(
          `New releases will automatically be announed in ${announceChannel}.`
        )
        embed.setDescription(description.join('\n\n'))
        _duration = duration
      }

      msg.channel.send(embed)
      cleanupInvocation(msg)
    } catch (error) {
      console.error(error)
      cleanupInvocation(msg)
    }
  }
}
